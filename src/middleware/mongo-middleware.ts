import { MongoConnectionType } from "@lindorm-io/mongo";
import { IS_TEST, MONGO_CONNECTION_OPTIONS } from "../config";
import { TPromise } from "@lindorm-io/core";
import { inMemoryStore } from "../test";
import { mongoMiddleware } from "@lindorm-io/koa-mongo";

export const getMongoMiddleware = (): TPromise<void> =>
  mongoMiddleware({
    ...MONGO_CONNECTION_OPTIONS,
    type: IS_TEST ? MongoConnectionType.MEMORY : MONGO_CONNECTION_OPTIONS.type,
    inMemoryStore: IS_TEST ? inMemoryStore : undefined,
  });
