import Joi from "@hapi/joi";
import { IKoaAuthContext } from "../../typing";
import { assertAccountAdmin, encryptClientSecret } from "../../support";
import { Client } from "@lindorm-io/koa-client";

export interface ICreateClientOptions {
  description: string;
  emailAuthorizationUri: string;
  name: string;
  secret: string;
}

export interface ICreateClientData {
  clientId: string;
}

const schema = Joi.object({
  description: Joi.string(),
  emailAuthorizationUri: Joi.string().uri(),
  name: Joi.string(),
  secret: Joi.string().allow(null).min(32),
});

export const createClient = (ctx: IKoaAuthContext) => async (
  options: ICreateClientOptions,
): Promise<ICreateClientData> => {
  await schema.validateAsync(options);

  const { account, cache, logger, repository } = ctx;
  const { description, emailAuthorizationUri, name, secret } = options;

  await assertAccountAdmin(ctx)();

  const client = new Client({
    description,
    extra: emailAuthorizationUri ? { emailAuthorizationUri } : {},
    name,
    secret: secret && { signature: encryptClientSecret(secret), updated: new Date() },
  });

  await repository.client.create(client);
  await cache.client.create(client);

  logger.debug("client created", {
    accountId: account.id,
    clientId: client.id,
  });

  return { clientId: client.id };
};
