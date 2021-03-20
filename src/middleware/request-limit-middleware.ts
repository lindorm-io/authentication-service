import Joi from "@hapi/joi";
import { CacheEntityNotFoundError } from "@lindorm-io/redis";
import { IKoaAuthContext } from "../typing";
import { JOI_EMAIL, JOI_GRANT_TYPE } from "../constant";
import { RequestLimitCache } from "../infrastructure";
import { RequestLimitFailedTryError } from "../error";
import { TPromise } from "@lindorm-io/core";
import { createOrUpdateRequestLimit, validateRequestLimitBackOff } from "../support";

const schema = Joi.object({
  grantType: JOI_GRANT_TYPE,
  subject: JOI_EMAIL,
});

export const requestLimitMiddleware = async (ctx: IKoaAuthContext, next: TPromise<void>): Promise<void> => {
  const start = Date.now();

  const { cache, logger } = ctx;
  const { grantType, subject } = ctx.request.body;

  logger.debug("request limit middleware initialising");

  await schema.validateAsync({ grantType, subject });

  try {
    ctx.requestLimit = await cache.requestLimit.find(RequestLimitCache.getKey({ grantType, subject }));

    logger.debug("request is rate-limited");
  } catch (err) {
    if (err instanceof CacheEntityNotFoundError) {
      logger.debug("request is not rate-limited");
    } else {
      throw err;
    }
  }

  ctx.metrics = {
    ...(ctx.metrics || {}),
    requestLimit: Date.now() - start,
  };

  if (ctx.requestLimit) {
    logger.debug("validating request limit back-off");

    validateRequestLimitBackOff(ctx)();
  }

  try {
    logger.debug("request limit middleware initialised");

    await next();
  } catch (err) {
    await createOrUpdateRequestLimit(ctx)({ grantType, subject });

    logger.error("caught error", err);

    throw new RequestLimitFailedTryError(ctx.requestLimit, err);
  }
};
