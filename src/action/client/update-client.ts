import Joi from "@hapi/joi";
import { IAuthContext } from "../../typing";
import { assertAccountAdmin, encryptClientSecret } from "../../support";
import { isBoolean, isString } from "lodash";

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
  description: Joi.string(),
  approved: Joi.boolean(),
  emailAuthorizationUri: Joi.string().uri(),
  name: Joi.string(),
  secret: Joi.string().allow(null).length(32),
});

export const updateClient = (ctx: IAuthContext) => async (options: IUpdateClientOptions): Promise<void> => {
  await schema.validateAsync(options);

  const { account, logger, repository } = ctx;
  const { approved, clientId, description, emailAuthorizationUri, name, secret } = options;

  await assertAccountAdmin(ctx)();

  const client = await repository.client.find({ id: clientId });

  if (isBoolean(approved)) {
    client.approved = approved;
  }
  if (isString(description)) {
    client.description = description;
  }
  if (isString(emailAuthorizationUri)) {
    client.emailAuthorizationUri = emailAuthorizationUri;
  }
  if (isString(name)) {
    client.name = name;
  }
  if (isString(secret)) {
    client.secret = encryptClientSecret(secret);
  }

  await repository.client.update(client);

  logger.debug("client updated", {
    accountId: account.id,
    clientId: client.id,
  });
};
