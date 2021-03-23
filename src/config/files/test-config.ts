import { IConfigurationData } from "../ConfigHandler";

export const testConfig: IConfigurationData = {
  NODE_ENVIRONMENT: process.env.NODE_ENV,
  SERVER_PORT: 3000,
  HOST: "https://test.authentication.lindorm.io",

  JWT_ISSUER: "https://test.authentication.lindorm.io",
  JWT_ACCESS_TOKEN_EXPIRY: "2 minutes",
  JWT_AUTHORIZATION_TOKEN_EXPIRY: "45 minutes",
  JWT_IDENTITY_TOKEN_EXPIRY: "1 days",
  JWT_MULTI_FACTOR_TOKEN_EXPIRY: "30 minutes",
  JWT_REFRESH_TOKEN_EXPIRY: "1 days",

  CRYPTO_AES_SECRET: "secret",
  CRYPTO_SHA_SECRET: "secret",

  ACCOUNT_OTP_ISSUER: "test.authentication.lindorm.io",

  MAILGUN_API_KEY: "api-key",
  MAILGUN_DOMAIN: "test.lindorm.io",
  MAILGUN_FROM: "auth@lindorm.io",

  REDIS_PORT: 6379,

  MONGO_INITDB_ROOT_USERNAME: "root",
  MONGO_INITDB_ROOT_PASSWORD: "password",
  MONGO_HOST: "localhost",
  MONGO_EXPOSE_PORT: 27017,
  MONGO_DB_NAME: "authentication",

  DEVICE_SERVICE_BASE_URL: "https://test.device.lindorm.io",
  DEVICE_SERVICE_AUTH_USERNAME: "secret",
  DEVICE_SERVICE_AUTH_PASSWORD: "secret",

  IDENTITY_SERVICE_BASE_URL: "https://test.identity.lindorm.io",
  IDENTITY_SERVICE_AUTH_USERNAME: "secret",
  IDENTITY_SERVICE_AUTH_PASSWORD: "secret",
};
