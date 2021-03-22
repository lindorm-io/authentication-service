import { AccountRepository, SessionRepository } from "../../infrastructure";
import { ClientRepository } from "@lindorm-io/koa-client";
import { KeyPairRepository } from "@lindorm-io/koa-keystore";
import { getTestMongo } from "./test-mongo";
import { winston } from "../../logger";

export interface IGetGreyBoxRepository {
  account: AccountRepository;
  client: ClientRepository;
  keyPair: KeyPairRepository;
  session: SessionRepository;
}

export const getTestRepository = async (): Promise<IGetGreyBoxRepository> => {
  const mongo = await getTestMongo();

  const db = mongo.getDatabase();
  const logger = winston;

  return {
    account: new AccountRepository({ db, logger }),
    client: new ClientRepository({ db, logger }),
    keyPair: new KeyPairRepository({ db, logger }),
    session: new SessionRepository({ db, logger }),
  };
};
