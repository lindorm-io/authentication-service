import Joi from "@hapi/joi";
import { IAuthContext } from "../typing";
import { JOI_EMAIL, JOI_GRANT_TYPE } from "../constant";
import { RequestLimitCache } from "../cache";
import { TPromise } from "@lindorm-io/core";
import { createOrUpdateRequestLimit, validateRequestLimitBackOff } from "../support";
import { CacheEntityNotFoundError } from "@lindorm-io/redis/dist/error";

const schema = Joi.object({
  grantType: JOI_GRANT_TYPE,
  subject: JOI_EMAIL,
});

export const requestLimitMiddleware = async (ctx: IAuthContext, next: TPromise<void>): Promise<void> => {
  const start = Date.now();

  const { cache, logger } = ctx;
  const { grantType, subject } = ctx.request.body;

  await schema.validateAsync({ grantType, subject });

  try {
    ctx.requestLimit = await cache.requestLimit.find(RequestLimitCache.getKey({ grantType, subject }));

    logger.info("request is rate-limited");
  } catch (err) {
    if (err instanceof CacheEntityNotFoundError) {
      logger.info("request is not rate-limited");
    } else {
      throw err;
    }
  }

  ctx.metrics = {
    ...(ctx.metrics || {}),
    requestLimit: Date.now() - start,
  };

  if (ctx.requestLimit) {
    validateRequestLimitBackOff(ctx)();
  }

  try {
    await next();
  } catch (err) {
    await createOrUpdateRequestLimit(ctx)({ grantType, subject });

    throw err;
  }
};
