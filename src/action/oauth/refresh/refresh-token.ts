import Joi from "@hapi/joi";
import { IAuthContext, ICreateTokensData } from "../../../typing";
import { JOI_GRANT_TYPE } from "../../../constant";
import { createTokens, extendSession } from "../../../support";
import { Permission } from "../../../enum";
import { InvalidPermissionError, InvalidRefreshTokenError } from "../../../error";

export interface IPerformRefreshTokenOptions {
  grantType: string;
  responseType: string;
}

const schema = Joi.object({
  grantType: JOI_GRANT_TYPE,
  responseType: Joi.string().required(),
});

export const performRefreshToken = (ctx: IAuthContext) => async (
  options: IPerformRefreshTokenOptions,
): Promise<ICreateTokensData> => {
  await schema.validateAsync(options);

  const { client, repository, token } = ctx;
  const { responseType } = options;
  const {
    refresh: { id: refreshId, authMethodsReference, permission },
  } = token;

  const session = await extendSession(ctx)();
  const account = await repository.account.find({ id: session.accountId });

  if (account.permission === Permission.LOCKED) {
    throw new InvalidPermissionError();
  }

  if (account.permission !== permission) {
    throw new InvalidRefreshTokenError(refreshId);
  }

  return createTokens(ctx)({
    account,
    authMethodsReference,
    client,
    responseType,
    session,
  });
};
