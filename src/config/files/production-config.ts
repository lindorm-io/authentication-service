import { IConfigurationData } from "../ConfigHandler";
import { NodeEnvironment } from "@lindorm-io/core";

export const productionConfig: IConfigurationData = {
  NODE_ENVIRONMENT: NodeEnvironment.PRODUCTION,
  SERVER_PORT: 3000,
  HOST: "https://lindorm.io/",

  JWT_ISSUER: "https://lindorm.io/",
  JWT_ACCESS_TOKEN_EXPIRY: "3 minutes",
  JWT_AUTHORIZATION_TOKEN_EXPIRY: "15 minutes",
  JWT_IDENTITY_TOKEN_EXPIRY: "7 days",
  JWT_MULTI_FACTOR_TOKEN_EXPIRY: "5 minutes",
  JWT_REFRESH_TOKEN_EXPIRY: "7 days",

  CRYPTO_AES_SECRET: null,
  CRYPTO_SHA_SECRET: null,

  ACCOUNT_OTP_ISSUER: "lindorm.io",

  MAILGUN_API_KEY: null,
  MAILGUN_DOMAIN: "lindorm.io",
  MAILGUN_FROM: "noreply@lindorm.io",

  REDIS_PORT: null,

  MONGO_INITDB_ROOT_USERNAME: null,
  MONGO_INITDB_ROOT_PASSWORD: null,
  MONGO_HOST: null,
  MONGO_EXPOSE_PORT: null,
  MONGO_DB_NAME: null,
};
