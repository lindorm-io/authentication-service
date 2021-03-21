import { AccountRepository, SessionRepository } from "../../infrastructure";
import { ClientRepository } from "@lindorm-io/koa-client";
import { KeyPairRepository } from "@lindorm-io/koa-keystore";
import { MONGO_CONNECTION_OPTIONS } from "../../config";
import { MongoConnection, MongoConnectionType } from "@lindorm-io/mongo";
import { inMemoryStore } from "./in-memory";
import { winston } from "../../logger";

export interface IGetGreyBoxRepository {
  account: AccountRepository;
  client: ClientRepository;
  keyPair: KeyPairRepository;
  session: SessionRepository;
}

export const getGreyBoxRepository = async (): Promise<IGetGreyBoxRepository> => {
  const mongo = new MongoConnection({
    ...MONGO_CONNECTION_OPTIONS,
    type: MongoConnectionType.MEMORY,
    inMemoryStore,
  });

  await mongo.connect();

  const logger = winston;
  const db = mongo.getDatabase();

  return {
    account: new AccountRepository({ db, logger }),
    client: new ClientRepository({ db, logger }),
    keyPair: new KeyPairRepository({ db, logger }),
    session: new SessionRepository({ db, logger }),
  };
};
