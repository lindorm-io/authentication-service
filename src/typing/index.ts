import { Account, Device, RequestLimit } from "../entity";
import { AccountRepository, DeviceRepository, KeyPairRepository, SessionRepository } from "../infrastructure";
import { Client, ClientCache, ClientRepository } from "@lindorm-io/koa-client";
import { IKoaAppContext } from "@lindorm-io/koa";
import { ITokenIssuerSignData, ITokenIssuerVerifyData, TokenIssuer } from "@lindorm-io/jwt";
import { KeyPairCache, RequestLimitCache } from "../infrastructure";
import { Keystore } from "@lindorm-io/key-pair";
import { MongoConnection } from "@lindorm-io/mongo";
import { RedisConnection } from "@lindorm-io/redis";
import { TObject } from "@lindorm-io/core";

export interface IAuthContext extends IKoaAppContext {
  account: Account;
  cache: {
    client: ClientCache;
    keyPair: KeyPairCache;
    requestLimit: RequestLimitCache;
  };
  client: Client;
  device: Device;
  issuer: {
    tokenIssuer: TokenIssuer;
  };
  keystore: Keystore;
  mongo: MongoConnection;
  redis: RedisConnection;
  repository: {
    account: AccountRepository;
    client: ClientRepository;
    device: DeviceRepository;
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
    geoIp: TObject<any>;
    os: string;
    platform: string;
    source: string;
    version: string;
  };
}

export interface ICreateTokensData {
  accessToken?: ITokenIssuerSignData;
  identityToken?: ITokenIssuerSignData;
  multiFactorToken?: ITokenIssuerSignData;
  refreshToken?: ITokenIssuerSignData;
}
