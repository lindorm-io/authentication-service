import { Account, RequestLimit } from "../entity";
import { AccountRepository, AuthorizationCache, SessionRepository } from "../infrastructure";
import { Axios } from "@lindorm-io/axios";
import { Client, ClientCache, ClientRepository } from "@lindorm-io/koa-client";
import { IKoaAppContext } from "@lindorm-io/koa";
import { ITokenIssuerVerifyData, TokenIssuer } from "@lindorm-io/jwt";
import { KeyPairCache, KeyPairRepository } from "@lindorm-io/koa-keystore";
import { Keystore } from "@lindorm-io/key-pair";
import { MongoConnection } from "@lindorm-io/mongo";
import { RedisConnection } from "@lindorm-io/redis";
import { RequestLimitCache } from "../infrastructure";

export interface IKoaAuthContext extends IKoaAppContext {
  account: Account;
  axios: {
    device: Axios;
    identity: Axios;
  };
  cache: {
    authorization: AuthorizationCache;
    client: ClientCache;
    keyPair: {
      auth: KeyPairCache;
    };
    requestLimit: RequestLimitCache;
  };
  client: Client;
  issuer: {
    auth: TokenIssuer;
  };
  keystore: {
    auth: Keystore;
  };
  mongo: MongoConnection;
  redis: RedisConnection;
  repository: {
    account: AccountRepository;
    client: ClientRepository;
    keyPair: KeyPairRepository;
    session: SessionRepository;
  };
  requestLimit: RequestLimit;
  token: {
    authorization?: ITokenIssuerVerifyData;
    bearer?: ITokenIssuerVerifyData;
    identity?: ITokenIssuerVerifyData;
    multiFactor?: ITokenIssuerVerifyData;
    refresh?: ITokenIssuerVerifyData;
  };
}
