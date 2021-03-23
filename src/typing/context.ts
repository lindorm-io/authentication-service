import { Account, RequestLimit } from "../entity";
import { AccountRepository, SessionRepository } from "../infrastructure";
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
  cache: {
    client: ClientCache;
    keyPair: KeyPairCache;
    requestLimit: RequestLimitCache;
  };
  client: Client;
  issuer: {
    tokenIssuer: TokenIssuer;
  };
  keystore: Keystore;
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
  userAgent: {
    browser: string;
    geoIp: Record<string, any>;
    os: string;
    platform: string;
    source: string;
    version: string;
  };
}
