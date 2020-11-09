import { config } from "dotenv";
import { isString } from "lodash";
import { IConfiguration } from "../typing";
import { NodeEnvironment } from "@lindorm-io/core";

config();

export const configuration: IConfiguration = {
  NODE_ENVIRONMENT: process.env.NODE_ENV || NodeEnvironment.DEVELOPMENT,
  SERVER_PORT: isString(process.env.SERVER_PORT) ? parseInt(process.env.SERVER_PORT, 10) : null,
  HOST: process.env.HOST,

  JWT_ISSUER: process.env.JWT_ISSUER,
  JWT_ACCESS_TOKEN_EXPIRY: process.env.JWT_ACCESS_TOKEN_EXPIRY,
  JWT_AUTHORIZATION_TOKEN_EXPIRY: process.env.JWT_AUTHORIZATION_TOKEN_EXPIRY,
  JWT_IDENTITY_TOKEN_EXPIRY: process.env.JWT_IDENTITY_TOKEN_EXPIRY,
  JWT_MULTI_FACTOR_TOKEN_EXPIRY: process.env.JWT_MULTI_FACTOR_TOKEN_EXPIRY,
  JWT_REFRESH_TOKEN_EXPIRY: process.env.JWT_REFRESH_TOKEN_EXPIRY,

  CRYPTO_AES_SECRET: process.env.CRYPTO_AES_SECRET,
  CRYPTO_SHA_SECRET: process.env.CRYPTO_SHA_SECRET,

  ACCOUNT_OTP_ISSUER: process.env.ACCOUNT_OTP_ISSUER,

  MAILGUN_API_KEY: process.env.MAILGUN_API_KEY,
  MAILGUN_DOMAIN: process.env.MAILGUN_DOMAIN,
  MAILGUN_FROM: process.env.MAILGUN_FROM,

  MONGO_INITDB_ROOT_USERNAME: process.env.MONGO_INITDB_ROOT_USERNAME,
  MONGO_INITDB_ROOT_PASSWORD: process.env.MONGO_INITDB_ROOT_PASSWORD,
  MONGO_HOST: process.env.MONGO_HOST,
  MONGO_EXPOSE_PORT: isString(process.env.MONGO_EXPOSE_PORT) ? parseInt(process.env.MONGO_EXPOSE_PORT, 10) : null,
  MONGO_DB_NAME: process.env.MONGO_DB_NAME,
};
