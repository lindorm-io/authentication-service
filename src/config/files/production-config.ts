import { IConfigurationData } from "../ConfigHandler";

export const productionConfig: IConfigurationData = {
  NODE_ENVIRONMENT: process.env.NODE_ENV,
  SERVER_PORT: 3000,
  HOST: "https://authentication.lindorm.io/",

  JWT_ISSUER: "https://authentication.lindorm.io",
  JWT_ACCESS_TOKEN_EXPIRY: "3 minutes",
  JWT_AUTHORIZATION_TOKEN_EXPIRY: "15 minutes",
  JWT_IDENTITY_TOKEN_EXPIRY: "7 days",
  JWT_MULTI_FACTOR_TOKEN_EXPIRY: "5 minutes",
  JWT_REFRESH_TOKEN_EXPIRY: "7 days",

  CRYPTO_AES_SECRET: null,
  CRYPTO_SHA_SECRET: null,

  ACCOUNT_OTP_ISSUER: "authentication.lindorm.io",

  MAILGUN_API_KEY: null,
  MAILGUN_DOMAIN: "lindorm.io",
  MAILGUN_FROM: "auth@lindorm.io",

  REDIS_PORT: null,

  MONGO_INITDB_ROOT_USERNAME: null,
  MONGO_INITDB_ROOT_PASSWORD: null,
  MONGO_HOST: null,
  MONGO_EXPOSE_PORT: null,
  MONGO_DB_NAME: null,

  DEVICE_SERVICE_BASE_URL: "https://device.lindorm.io",
  DEVICE_SERVICE_AUTH_USERNAME: null,
  DEVICE_SERVICE_AUTH_PASSWORD: null,

  IDENTITY_SERVICE_BASE_URL: "https://identity.lindorm.io",
  IDENTITY_SERVICE_AUTH_USERNAME: null,
  IDENTITY_SERVICE_AUTH_PASSWORD: null,
};
