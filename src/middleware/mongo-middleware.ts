import { MONGO_OPTIONS, NODE_ENVIRONMENT } from "../config";
import { MongoInMemoryConnection } from "@lindorm-io/mongo";
import { NodeEnvironment, TPromise } from "@lindorm-io/core";
import { mongoInMemoryMiddleware, mongoMiddleware } from "@lindorm-io/koa-mongo";
import { winston } from "../logger";
import {
  AccountRepository,
  ClientRepository,
  DeviceRepository,
  KeyPairRepository,
  SessionRepository,
} from "../repository";

export let mongoInMemory: MongoInMemoryConnection;
export let accountInMemory: AccountRepository;
export let clientInMemory: ClientRepository;
export let deviceInMemory: DeviceRepository;
export let keyPairInMemory: KeyPairRepository;
export let sessionInMemory: SessionRepository;

if (NODE_ENVIRONMENT === NodeEnvironment.TEST) {
  mongoInMemory = new MongoInMemoryConnection(MONGO_OPTIONS);

  const db = mongoInMemory.db();
  const logger = winston;

  accountInMemory = new AccountRepository({ db, logger });
  clientInMemory = new ClientRepository({ db, logger });
  deviceInMemory = new DeviceRepository({ db, logger });
  keyPairInMemory = new KeyPairRepository({ db, logger });
  sessionInMemory = new SessionRepository({ db, logger });
}

export const getMongoMiddleware = (): TPromise<any> => {
  if (NODE_ENVIRONMENT === NodeEnvironment.TEST) {
    return mongoInMemoryMiddleware(mongoInMemory);
  } else {
    return mongoMiddleware(MONGO_OPTIONS);
  }
};
