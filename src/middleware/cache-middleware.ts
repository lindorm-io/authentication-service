import { ClientCache } from "@lindorm-io/koa-client";
import { IAuthContext } from "../typing";
import { KeyPairCache, RequestLimitCache } from "../infrastructure";
import { TPromise } from "@lindorm-io/core";

export const cacheMiddleware = async (ctx: IAuthContext, next: TPromise<void>): Promise<void> => {
  const start = Date.now();

  const { redis, logger } = ctx;
  const client = await redis.getClient();

  ctx.cache = {
    client: new ClientCache({ client, logger }),
    keyPair: new KeyPairCache({ client, logger }),
    requestLimit: new RequestLimitCache({ client, logger }),
  };

  logger.debug("redis cache connected");

  ctx.metrics = {
    ...(ctx.metrics || {}),
    cache: Date.now() - start,
  };

  await next();
};
