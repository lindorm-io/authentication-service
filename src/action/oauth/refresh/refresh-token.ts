import Joi from "@hapi/joi";
import { IAuthContext, ICreateTokensData } from "../../../typing";
import { InvalidPermissionError, InvalidRefreshTokenError, InvalidSubjectError } from "../../../error";
import { JOI_EMAIL, JOI_GRANT_TYPE } from "../../../constant";
import { isLocked } from "@lindorm-io/jwt";
import { createTokens, extendSession } from "../../../support";

export interface IPerformRefreshTokenOptions {
  grantType: string;
  responseType: string;
  subject: string;
}

const schema = Joi.object({
  grantType: JOI_GRANT_TYPE,
  responseType: Joi.string().required(),
  subject: JOI_EMAIL,
});

export const performRefreshToken = (ctx: IAuthContext) => async (
  options: IPerformRefreshTokenOptions,
): Promise<ICreateTokensData> => {
  await schema.validateAsync(options);

  const { client, repository, token } = ctx;
  const { responseType, subject } = options;
  const {
    refresh: { id: refreshId, authMethodsReference, permission },
  } = token;

  const session = await extendSession(ctx)();
  const account = await repository.account.find({ id: session.accountId });

  if (isLocked(account.permission)) {
    throw new InvalidPermissionError();
  }

  if (account.permission !== permission) {
    throw new InvalidRefreshTokenError(refreshId);
  }

  if (account.email !== subject) {
    throw new InvalidSubjectError(subject);
  }

  return createTokens(ctx)({
    account,
    authMethodsReference,
    client,
    responseType,
    session,
  });
};
