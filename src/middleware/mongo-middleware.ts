import { IMongoConnectionOptions, MongoConnectionType } from "@lindorm-io/mongo";
import { NODE_ENVIRONMENT } from "../config";
import { NodeEnvironment, TObject, TPromise } from "@lindorm-io/core";
import { mongoMiddleware } from "@lindorm-io/koa-mongo";

export const inMemoryStore: TObject<any> = {};

export const getMongoMiddleware = (options: IMongoConnectionOptions): TPromise<void> => {
  const isTest = NODE_ENVIRONMENT === NodeEnvironment.TEST;

  return mongoMiddleware({
    ...options,
    type: isTest ? MongoConnectionType.MEMORY : options.type,
    inMemoryStore: isTest ? inMemoryStore : options.inMemoryStore,
  });
};
