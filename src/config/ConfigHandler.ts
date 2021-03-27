import { ConfigurationBase, IConfigurationDataBase, IConfigurationOptions } from "@lindorm-io/koa-config";

export interface IConfigurationData extends IConfigurationDataBase {
  SERVER_PORT: number;
  HOST: string;

  // Secrets
  CRYPTO_AES_SECRET: string;
  CRYPTO_SHA_SECRET: string;

  // Tokens
  JWT_ISSUER: string;

  // Authentication
  ACCOUNT_OTP_ISSUER: string;

  // Emails
  MAILGUN_API_KEY: string;
  MAILGUN_DOMAIN: string;
  MAILGUN_FROM: string;

  // Expiry
  JWT_ACCESS_TOKEN_EXPIRY: string;
  JWT_AUTHORIZATION_TOKEN_EXPIRY: string;
  JWT_IDENTITY_TOKEN_EXPIRY: string;
  JWT_MULTI_FACTOR_TOKEN_EXPIRY: string;
  JWT_REFRESH_TOKEN_EXPIRY: string;

  // Infrastructure
  REDIS_PORT: number;

  MONGO_INITDB_ROOT_USERNAME: string;
  MONGO_INITDB_ROOT_PASSWORD: string;
  MONGO_HOST: string;
  MONGO_EXPOSE_PORT: number;
  MONGO_DB_NAME: string;

  // Services
  DEVICE_SERVICE_BASE_URL: string;
  DEVICE_SERVICE_AUTH_USERNAME: string;
  DEVICE_SERVICE_AUTH_PASSWORD: string;

  IDENTITY_SERVICE_BASE_URL: string;
  IDENTITY_SERVICE_AUTH_USERNAME: string;
  IDENTITY_SERVICE_AUTH_PASSWORD: string;
}

export class ConfigHandler extends ConfigurationBase<IConfigurationData> {
  constructor(options: IConfigurationOptions<IConfigurationData>) {
    super(options);
  }
}
