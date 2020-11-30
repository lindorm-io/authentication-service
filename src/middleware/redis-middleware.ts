import { IRedisConnectionOptions, RedisConnectionType } from "@lindorm-io/redis";
import { NODE_ENVIRONMENT, REDIS_CONNECTION_OPTIONS } from "../config";
import { NodeEnvironment, TPromise } from "@lindorm-io/core";
import { inMemoryCache } from "../test";
import { redisMiddleware } from "@lindorm-io/koa-redis";

export const getRedisMiddleware = (): TPromise<void> => {
  const isTest = NODE_ENVIRONMENT === NodeEnvironment.TEST;
  const options: IRedisConnectionOptions = REDIS_CONNECTION_OPTIONS;

  return redisMiddleware({
    ...options,
    type: isTest ? RedisConnectionType.MEMORY : options.type,
    inMemoryCache: isTest ? inMemoryCache : undefined,
  });
};
