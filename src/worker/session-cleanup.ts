import { IRepositoryOptions, mongoQuery } from "@lindorm-io/mongo";
import { IntervalWorker } from "@lindorm-io/koa";
import { MONGO_MW_OPTIONS } from "../config";
import { SessionRepository } from "../repository";
import { stringToMilliseconds } from "@lindorm-io/core";
import { winston } from "../logger";

const logger = winston.createChildLogger(["session", "cleanup"]);

const mongoCallback = async (options: IRepositoryOptions): Promise<void> => {
  const repository = new SessionRepository(options);
  await repository.removeMany({ expires: { $lt: new Date() } });
};

const workerCallback = async (): Promise<void> => {
  return mongoQuery(
    {
      mongoOptions: MONGO_MW_OPTIONS,
      logger,
    },
    mongoCallback,
  );
};

export const sessionCleanupWorker = new IntervalWorker({
  callback: workerCallback,
  logger,
  time: stringToMilliseconds("60 minutes"),
});
