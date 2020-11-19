import { ConfigurationBase, IConfigurationDataBase, IConfigurationOptions } from "@lindorm-io/core";

export interface IConfigurationData extends IConfigurationDataBase {
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

export class Config extends ConfigurationBase<IConfigurationData> {
  constructor(options: IConfigurationOptions<IConfigurationData>) {
    super(options);
  }
}
