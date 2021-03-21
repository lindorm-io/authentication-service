import { MONGO_CONNECTION_OPTIONS, REDIS_CONNECTION_OPTIONS } from "../config";
import { clientMongoCacheWorker } from "@lindorm-io/koa-client";
import { stringToSeconds } from "@lindorm-io/core";
import { winston } from "../logger";

export const clientCacheWorker = clientMongoCacheWorker({
  mongoConnectionOptions: MONGO_CONNECTION_OPTIONS,
  redisConnectionOptions: REDIS_CONNECTION_OPTIONS,
  winston,
  workerIntervalInSeconds: stringToSeconds("60 minutes"),
});
