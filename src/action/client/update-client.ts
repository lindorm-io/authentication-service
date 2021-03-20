import Joi from "@hapi/joi";
import { IKoaAuthContext } from "../../typing";
import { assertAccountAdmin, encryptClientSecret } from "../../support";
import { isBoolean } from "lodash";

export interface IUpdateClientOptions {
  approved?: boolean;
  clientId: string;
  description?: string;
  emailAuthorizationUri?: string;
  jwtAccessTokenExpiry?: string;
  jwtAuthorizationTokenExpiry?: string;
  jwtIdentityTokenExpiry?: string;
  jwtMultiFactorTokenExpiry?: string;
  jwtRefreshTokenExpiry?: string;
  name?: string;
  secret?: string;
}

const schema = Joi.object({
  clientId: Joi.string().guid().required(),
  approved: Joi.boolean(),
  description: Joi.string(),
  emailAuthorizationUri: Joi.string().uri(),
  jwtAccessTokenExpiry: Joi.string(),
  jwtAuthorizationTokenExpiry: Joi.string(),
  jwtIdentityTokenExpiry: Joi.string(),
  jwtMultiFactorTokenExpiry: Joi.string(),
  jwtRefreshTokenExpiry: Joi.string(),
  name: Joi.string(),
  secret: Joi.string().allow(null).length(32),
});

export const updateClient = (ctx: IKoaAuthContext) => async (options: IUpdateClientOptions): Promise<void> => {
  await schema.validateAsync(options);

  const { account, cache, logger, repository } = ctx;
  const {
    approved,
    clientId,
    description,
    emailAuthorizationUri,
    jwtAccessTokenExpiry,
    jwtAuthorizationTokenExpiry,
    jwtIdentityTokenExpiry,
    jwtMultiFactorTokenExpiry,
    jwtRefreshTokenExpiry,
    name,
    secret,
  } = options;

  await assertAccountAdmin(ctx)();

  const client = await repository.client.find({ id: clientId });

  if (isBoolean(approved)) {
    client.approved = approved;
  }
  if (description) {
    client.description = description;
  }
  if (emailAuthorizationUri) {
    client.extra = { ...client.extra, emailAuthorizationUri };
  }
  if (jwtAccessTokenExpiry) {
    client.extra = { ...client.extra, jwtAccessTokenExpiry };
  }
  if (jwtAuthorizationTokenExpiry) {
    client.extra = { ...client.extra, jwtAuthorizationTokenExpiry };
  }
  if (jwtIdentityTokenExpiry) {
    client.extra = { ...client.extra, jwtIdentityTokenExpiry };
  }
  if (jwtMultiFactorTokenExpiry) {
    client.extra = { ...client.extra, jwtMultiFactorTokenExpiry };
  }
  if (jwtRefreshTokenExpiry) {
    client.extra = { ...client.extra, jwtRefreshTokenExpiry };
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
