import { RedisConnectionType } from "@lindorm-io/redis";
import { IS_TEST, REDIS_CONNECTION_OPTIONS } from "../config";
import { inMemoryCache } from "../test";
import { redisMiddleware } from "@lindorm-io/koa-redis";
import { Middleware } from "koa";

export const getRedisMiddleware = (): Middleware =>
  redisMiddleware({
    ...REDIS_CONNECTION_OPTIONS,
    type: IS_TEST ? RedisConnectionType.MEMORY : REDIS_CONNECTION_OPTIONS.type,
    inMemoryCache: IS_TEST ? inMemoryCache : undefined,
  });
