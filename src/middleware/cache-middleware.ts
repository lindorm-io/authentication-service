import { IKoaAuthContext, TNext } from "../typing";
import { AuthorizationCache, RequestLimitCache } from "../infrastructure";
import { config } from "../config";
import { stringToSeconds } from "@lindorm-io/core";

export const cacheMiddleware = async (ctx: IKoaAuthContext, next: TNext): Promise<void> => {
  const start = Date.now();

  const { redis, logger } = ctx;
  const client = await redis.getClient();

  ctx.cache = {
    ...ctx.cache,
    authorization: new AuthorizationCache({
      client,
      expiresInSeconds: stringToSeconds(config.JWT_AUTHORIZATION_TOKEN_EXPIRY) + 60,
      logger,
    }),
    requestLimit: new RequestLimitCache({
      client,
      expiresInSeconds: stringToSeconds("91 minutes"),
      logger,
    }),
  };

  logger.debug("redis cache connected");

  ctx.metrics = {
    ...(ctx.metrics || {}),
    cache: Date.now() - start,
  };

  await next();
};
