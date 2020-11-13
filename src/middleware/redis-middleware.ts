import { IRedisConnectionOptions, RedisConnectionType } from "@lindorm-io/redis";
import { NODE_ENVIRONMENT } from "../config";
import { NodeEnvironment, TObject, TPromise } from "@lindorm-io/core";
import { redisMiddleware } from "@lindorm-io/koa-redis";

export const inMemoryCache: TObject<any> = {};

export const getRedisMiddleware = (options: IRedisConnectionOptions): TPromise<void> => {
  const isTest = NODE_ENVIRONMENT === NodeEnvironment.TEST;

  return redisMiddleware({
    ...options,
    type: isTest ? RedisConnectionType.MEMORY : options.type,
    inMemoryCache: isTest ? inMemoryCache : options.inMemoryCache,
  });
};
