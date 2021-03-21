import { IKoaAuthContext, TPromise } from "../typing";
import { RequestLimitCache } from "../infrastructure";

export const cacheMiddleware = async (ctx: IKoaAuthContext, next: TPromise<void>): Promise<void> => {
  const start = Date.now();

  const { redis, logger } = ctx;
  const client = await redis.getClient();

  ctx.cache = {
    ...ctx.cache,
    requestLimit: new RequestLimitCache({ client, logger }),
  };

  logger.debug("redis cache connected");

  ctx.metrics = {
    ...(ctx.metrics || {}),
    cache: Date.now() - start,
  };

  await next();
};
