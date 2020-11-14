import { IntervalWorker } from "@lindorm-io/koa";
import { MONGO_CONNECTION_OPTIONS } from "../config";
import { MongoConnection } from "@lindorm-io/mongo";
import { SessionRepository } from "../infrastructure";
import { stringToMilliseconds } from "@lindorm-io/core";
import { winston } from "../logger";

const logger = winston.createChildLogger(["session", "cleanup"]);

const workerInterval = stringToMilliseconds("60 minutes");

const workerCallback = async (): Promise<void> => {
  const mongo = new MongoConnection(MONGO_CONNECTION_OPTIONS);
  await mongo.connect();
  const repository = new SessionRepository({
    db: mongo.getDatabase(),
    logger,
  });

  await repository.removeMany({ expires: { $lt: new Date() } });
};

export const sessionCleanupWorker = new IntervalWorker({
  callback: workerCallback,
  logger,
  time: workerInterval,
});
