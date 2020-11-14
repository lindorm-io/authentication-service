import { IntervalWorker } from "@lindorm-io/koa";
import { KeyPairCache } from "../infrastructure";
import { KeyPairRepository } from "../infrastructure";
import { MONGO_CONNECTION_OPTIONS, REDIS_CONNECTION_OPTIONS } from "../config";
import { MongoConnection } from "@lindorm-io/mongo";
import { RedisConnection } from "@lindorm-io/redis";
import { stringToMilliseconds } from "@lindorm-io/core";
import { winston } from "../logger";

const logger = winston.createChildLogger(["client", "cache", "update"]);

const expiresInSeconds = 5 * 60; // 5 minutes
const workerInterval = stringToMilliseconds("3 minutes");

const workerCallback = async (): Promise<void> => {
  const mongo = new MongoConnection(MONGO_CONNECTION_OPTIONS);
  await mongo.connect();
  const repository = new KeyPairRepository({
    db: mongo.getDatabase(),
    logger,
  });

  const redis = new RedisConnection(REDIS_CONNECTION_OPTIONS);
  await redis.connect();
  const cache = new KeyPairCache({
    client: redis.getClient(),
    logger,
    expiresInSeconds,
  });

  const array = await repository.findMany({});

  for (const entity of array) {
    await cache.create(entity);
  }

  await mongo.disconnect();
  await redis.disconnect();
};

export const keyPairCacheWorker = new IntervalWorker({
  callback: workerCallback,
  logger,
  time: workerInterval,
});
