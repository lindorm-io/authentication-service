import dotenv from "dotenv";
import { Audience } from "../enum";
import { ConfigHandler } from "./ConfigHandler";
import { MongoConnectionType } from "@lindorm-io/mongo";
import { NodeEnvironment } from "@lindorm-io/core";
import { RedisConnectionType } from "@lindorm-io/redis";
import { developmentConfig, environmentConfig, productionConfig, stagingConfig, testConfig } from "./files";

if (!process.env.NODE_ENV) dotenv.config();

const handler = new ConfigHandler({
  productionConfig,
  stagingConfig,
  developmentConfig,
  environmentConfig,
  testConfig,
});

export const { NODE_ENVIRONMENT } = environmentConfig;
const config = handler.get(NODE_ENVIRONMENT);

export const SERVER_PORT = config.SERVER_PORT;
export const HOST = config.HOST;

export const IS_TEST = NODE_ENVIRONMENT === NodeEnvironment.TEST;

export const JWT_ISSUER = config.JWT_ISSUER;
export const JWT_ACCESS_TOKEN_EXPIRY = config.JWT_ACCESS_TOKEN_EXPIRY;
export const JWT_AUTHORIZATION_TOKEN_EXPIRY = config.JWT_AUTHORIZATION_TOKEN_EXPIRY;
export const JWT_IDENTITY_TOKEN_EXPIRY = config.JWT_IDENTITY_TOKEN_EXPIRY;
export const JWT_MULTI_FACTOR_TOKEN_EXPIRY = config.JWT_MULTI_FACTOR_TOKEN_EXPIRY;
export const JWT_REFRESH_TOKEN_EXPIRY = config.JWT_REFRESH_TOKEN_EXPIRY;

export const MAIL_HANDLER_CONFIG = {
  apiKey: config.MAILGUN_API_KEY,
  domain: config.MAILGUN_DOMAIN,
  environment: NODE_ENVIRONMENT,
  from: config.MAILGUN_FROM,
};

export const CRYPTO_PASSWORD_OPTIONS = {
  aesSecret: config.CRYPTO_AES_SECRET,
  shaSecret: config.CRYPTO_SHA_SECRET,
};

export const CRYPTO_SECRET_OPTIONS = {
  aesSecret: config.CRYPTO_AES_SECRET,
  shaSecret: config.CRYPTO_SHA_SECRET,
};

export const OTP_HANDLER_OPTIONS = {
  issuer: config.ACCOUNT_OTP_ISSUER,
  secret: config.CRYPTO_AES_SECRET,
};

export const MONGO_CONNECTION_OPTIONS = {
  type: MongoConnectionType.STORAGE,
  auth: {
    user: config.MONGO_INITDB_ROOT_USERNAME,
    password: config.MONGO_INITDB_ROOT_PASSWORD,
  },
  url: {
    host: config.MONGO_HOST,
    port: config.MONGO_EXPOSE_PORT,
  },
  databaseName: config.MONGO_DB_NAME,
};

export const REDIS_CONNECTION_OPTIONS = {
  type: RedisConnectionType.CACHE,
  port: config.REDIS_PORT,
};

export const BEARER_AUTH_MW_OPTIONS = {
  issuer: config.JWT_ISSUER,
  audience: Audience.ACCESS,
};

export const TOKEN_ISSUER_MW_OPTIONS = {
  issuer: config.JWT_ISSUER,
};

export const IDENTITY_SERVICE_BASE_URL = config.IDENTITY_SERVICE_BASE_URL;
export const IDENTITY_SERVICE_BASIC_AUTH = {
  username: config.IDENTITY_SERVICE_AUTH_USERNAME,
  password: config.IDENTITY_SERVICE_AUTH_PASSWORD,
};

export const DEVICE_SERVICE_BASE_URL = config.DEVICE_SERVICE_BASE_URL;
export const DEVICE_SERVICE_BASIC_AUTH = {
  username: config.DEVICE_SERVICE_AUTH_USERNAME,
  password: config.DEVICE_SERVICE_AUTH_PASSWORD,
};
