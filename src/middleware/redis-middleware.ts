import { RedisConnectionType } from "@lindorm-io/redis";
import { IS_TEST, REDIS_CONNECTION_OPTIONS } from "../config";
import { TPromise } from "@lindorm-io/core";
import { inMemoryCache } from "../test";
import { redisMiddleware } from "@lindorm-io/koa-redis";

export const getRedisMiddleware = (): TPromise<void> =>
  redisMiddleware({
    ...REDIS_CONNECTION_OPTIONS,
    type: IS_TEST ? RedisConnectionType.MEMORY : REDIS_CONNECTION_OPTIONS.type,
    inMemoryCache: IS_TEST ? inMemoryCache : undefined,
  });
