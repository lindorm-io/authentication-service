import { Account, Client, Device, RequestLimit } from "../entity";
import { ClientCache, KeyPairCache, RequestLimitCache } from "../infrastructure";
import { IKoaAppContext } from "@lindorm-io/koa";
import { ITokenIssuerSignData, ITokenIssuerVerifyData, TokenIssuer } from "@lindorm-io/jwt";
import { Keystore } from "@lindorm-io/key-pair";
import { MongoConnection } from "@lindorm-io/mongo";
import { RedisConnection } from "@lindorm-io/redis";
import { TObject } from "@lindorm-io/core";
import {
  AccountRepository,
  ClientRepository,
  DeviceRepository,
  KeyPairRepository,
  SessionRepository,
} from "../infrastructure";

export interface IAuthCache {
  client: ClientCache;
  keyPair: KeyPairCache;
  requestLimit: RequestLimitCache;
}

export interface IAuthIssuer {
  tokenIssuer: TokenIssuer;
}

export interface IAuthRepository {
  account: AccountRepository;
  client: ClientRepository;
  device: DeviceRepository;
  keyPair: KeyPairRepository;
  session: SessionRepository;
}

export interface IAuthToken {
  authorization?: ITokenIssuerVerifyData;
  bearer?: ITokenIssuerVerifyData;
  identity?: ITokenIssuerVerifyData;
  multiFactor?: ITokenIssuerVerifyData;
  refresh?: ITokenIssuerVerifyData;
}

export interface IAuthUserAgent {
  browser: string;
  geoIp: TObject<any>;
  os: string;
  platform: string;
  source: string;
  version: string;
}

export interface IAuthContext extends IKoaAppContext {
  account: Account;
  cache: IAuthCache;
  client: Client;
  device: Device;
  issuer: IAuthIssuer;
  keystore: Keystore;
  mongo: MongoConnection;
  redis: RedisConnection;
  repository: IAuthRepository;
  requestLimit: RequestLimit;
  token: IAuthToken;
  userAgent: IAuthUserAgent;
}

export interface ICreateTokensData {
  accessToken?: ITokenIssuerSignData;
  identityToken?: ITokenIssuerSignData;
  multiFactorToken?: ITokenIssuerSignData;
  refreshToken?: ITokenIssuerSignData;
}
export interface IConfiguration {
  NODE_ENVIRONMENT: string;
  SERVER_PORT: number;
  HOST: string;

  JWT_ISSUER: string;
  JWT_ACCESS_TOKEN_EXPIRY: string;
  JWT_AUTHORIZATION_TOKEN_EXPIRY: string;
  JWT_IDENTITY_TOKEN_EXPIRY: string;
  JWT_MULTI_FACTOR_TOKEN_EXPIRY: string;
  JWT_REFRESH_TOKEN_EXPIRY: string;

  CRYPTO_AES_SECRET: string;
  CRYPTO_SHA_SECRET: string;

  ACCOUNT_OTP_ISSUER: string;

  MAILGUN_API_KEY: string;
  MAILGUN_DOMAIN: string;
  MAILGUN_FROM: string;

  REDIS_PORT: number;

  MONGO_INITDB_ROOT_USERNAME: string;
  MONGO_INITDB_ROOT_PASSWORD: string;
  MONGO_HOST: string;
  MONGO_EXPOSE_PORT: number;
  MONGO_DB_NAME: string;
}
