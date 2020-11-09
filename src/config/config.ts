import { Audience } from "../enum";
import { IConfiguration } from "../typing";
import { configuration as env } from "./default-test";
import { mergeConfiguration } from "./merge-configuration";
import { switchConfiguration } from "./switch-configuration";

export const { NODE_ENVIRONMENT } = env;

const config: IConfiguration = mergeConfiguration(env, switchConfiguration(NODE_ENVIRONMENT));

export const SERVER_PORT = config.SERVER_PORT;
export const HOST = config.HOST;

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

export const MONGO_OPTIONS = {
  user: config.MONGO_INITDB_ROOT_USERNAME,
  password: config.MONGO_INITDB_ROOT_PASSWORD,
  host: config.MONGO_HOST,
  port: config.MONGO_EXPOSE_PORT,
  name: config.MONGO_DB_NAME,
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

export const BEARER_TOKEN_MW_OPTIONS = {
  issuer: config.JWT_ISSUER,
  audience: Audience.ACCESS,
};

export const TOKEN_ISSUER_MW_OPTIONS = {
  issuer: config.JWT_ISSUER,
};
