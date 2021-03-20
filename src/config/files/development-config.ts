import { IConfigurationData } from "../ConfigHandler";

export const developmentConfig: IConfigurationData = {
  NODE_ENVIRONMENT: process.env.NODE_ENV,
  SERVER_PORT: 3001,
  HOST: "http://localhost/",

  JWT_ISSUER: "https://dev.authentication.lindorm.io",
  JWT_ACCESS_TOKEN_EXPIRY: "1 minutes",
  JWT_AUTHORIZATION_TOKEN_EXPIRY: "30 minutes",
  JWT_IDENTITY_TOKEN_EXPIRY: "5 minutes",
  JWT_MULTI_FACTOR_TOKEN_EXPIRY: "30 minutes",
  JWT_REFRESH_TOKEN_EXPIRY: "5 minutes",

  CRYPTO_AES_SECRET: "secret",
  CRYPTO_SHA_SECRET: "secret",

  ACCOUNT_OTP_ISSUER: "dev.authentication.lindorm.io",

  MAILGUN_API_KEY: "api-key",
  MAILGUN_DOMAIN: "dev.lindorm.io",
  MAILGUN_FROM: "auth@lindorm.io",

  REDIS_PORT: 6379,

  MONGO_INITDB_ROOT_USERNAME: "root",
  MONGO_INITDB_ROOT_PASSWORD: "example",
  MONGO_HOST: "localhost",
  MONGO_EXPOSE_PORT: 27017,
  MONGO_DB_NAME: "authentication",

  DEVICE_SERVICE_BASE_URL: "http://localhost:3003",
  DEVICE_SERVICE_AUTH_USERNAME: "secret",
  DEVICE_SERVICE_AUTH_PASSWORD: "secret",

  IDENTITY_SERVICE_BASE_URL: "http://localhost:3002",
  IDENTITY_SERVICE_AUTH_USERNAME: "secret",
  IDENTITY_SERVICE_AUTH_PASSWORD: "secret",
};
