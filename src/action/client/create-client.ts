import Joi from "@hapi/joi";
import { Client } from "../../entity";
import { IAuthContext } from "../../typing";
import { assertAccountAdmin, encryptClientSecret } from "../../support";

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
  secret: Joi.string().allow(null).length(32),
});

export const createClient = (ctx: IAuthContext) => async (
  options: ICreateClientOptions,
): Promise<ICreateClientData> => {
  await schema.validateAsync(options);

  const { account, logger, repository } = ctx;
  const { description, emailAuthorizationUri, name, secret } = options;

  await assertAccountAdmin(ctx)();

  const client = new Client({
    description,
    emailAuthorizationUri,
    name,
  });
  client.create();

  if (secret) {
    client.secret = encryptClientSecret(secret);
  }

  await repository.client.create(client);

  logger.debug("client created", {
    accountId: account.id,
    clientId: client.id,
  });

  return { clientId: client.id };
};
