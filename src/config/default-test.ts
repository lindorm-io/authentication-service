import { IConfiguration } from "../typing";
import { NodeEnvironment } from "@lindorm-io/core";

export const configuration: IConfiguration = {
  NODE_ENVIRONMENT: NodeEnvironment.DEVELOPMENT,
  SERVER_PORT: 3000,
  HOST: "http://localhost/",

  JWT_ISSUER: "https://test.lindorm.io/",
  JWT_ACCESS_TOKEN_EXPIRY: "2 minutes",
  JWT_AUTHORIZATION_TOKEN_EXPIRY: "45 minutes",
  JWT_IDENTITY_TOKEN_EXPIRY: "1 days",
  JWT_MULTI_FACTOR_TOKEN_EXPIRY: "30 minutes",
  JWT_REFRESH_TOKEN_EXPIRY: "1 days",

  CRYPTO_AES_SECRET: "secret",
  CRYPTO_SHA_SECRET: "secret",

  ACCOUNT_OTP_ISSUER: "test.lindorm.io",

  MAILGUN_API_KEY: "api-key",
  MAILGUN_DOMAIN: "test.lindorm.io",
  MAILGUN_FROM: "noreply@lindorm.io",

  MONGO_INITDB_ROOT_USERNAME: "root",
  MONGO_INITDB_ROOT_PASSWORD: "password",
  MONGO_HOST: "localhost",
  MONGO_EXPOSE_PORT: 27017,
  MONGO_DB_NAME: "authentication",
};
