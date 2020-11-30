import Joi from "@hapi/joi";
import { IAuthContext } from "../../typing";
import { assertAccountAdmin, encryptClientSecret } from "../../support";

export interface IUpdateClientOptions {
  clientId: string;
  approved?: boolean;
  description?: string;
  emailAuthorizationUri?: string;
  name?: string;
  secret?: string;
}

const schema = Joi.object({
  clientId: Joi.string().guid().required(),
  approved: Joi.boolean(),
  description: Joi.string(),
  emailAuthorizationUri: Joi.string().uri(),
  name: Joi.string(),
  secret: Joi.string().allow(null).length(32),
});

export const updateClient = (ctx: IAuthContext) => async (options: IUpdateClientOptions): Promise<void> => {
  await schema.validateAsync(options);

  const { account, cache, logger, repository } = ctx;
  const { approved, clientId, description, emailAuthorizationUri, name, secret } = options;

  await assertAccountAdmin(ctx)();

  const client = await repository.client.find({ id: clientId });

  if (approved) {
    client.approved = approved;
  }
  if (description) {
    client.description = description;
  }
  if (emailAuthorizationUri) {
    client.extra = { emailAuthorizationUri };
  }
  if (name) {
    client.name = name;
  }
  if (secret) {
    client.secret = encryptClientSecret(secret);
  }

  const updated = await repository.client.update(client);
  await cache.client.update(updated);

  logger.debug("client updated", {
    accountId: account.id,
    clientId: client.id,
  });
};
