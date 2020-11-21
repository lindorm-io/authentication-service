import Joi from "@hapi/joi";
import { IAuthContext, ICreateTokensData } from "../../../typing";
import { InvalidClientError } from "@lindorm-io/koa-client";
import { InvalidPermissionError, InvalidSubjectError } from "../../../error";
import { JOI_EMAIL, JOI_GRANT_TYPE } from "../../../constant";
import { assertAccountOTP, assertSessionIsNotExpired, authenticateSession, createTokens } from "../../../support";
import { isLocked } from "@lindorm-io/jwt";

export interface IPerformMultiFactorTokenOptions {
  bindingCode: string;
  grantType: string;
  subject: string;
}

const schema = Joi.object({
  bindingCode: Joi.string().required(),
  grantType: JOI_GRANT_TYPE,
  subject: JOI_EMAIL,
});

export const performMultiFactorToken = (ctx: IAuthContext) => async (
  options: IPerformMultiFactorTokenOptions,
): Promise<ICreateTokensData> => {
  await schema.validateAsync(options);

  const { client, repository, token } = ctx;
  const { bindingCode, subject } = options;
  const {
    multiFactor: { authMethodsReference, subject: sessionId },
  } = token;

  const session = await repository.session.find({ id: sessionId });

  assertSessionIsNotExpired(session);

  if (session.clientId !== client.id) {
    throw new InvalidClientError(client.id);
  }

  if (session.authorization.email !== subject) {
    throw new InvalidSubjectError(subject);
  }

  const account = await repository.account.find({ email: subject });

  if (isLocked(account.permission)) {
    throw new InvalidPermissionError();
  }

  await assertAccountOTP(account, bindingCode);

  const authenticated = await authenticateSession(ctx)({
    account,
    session,
  });

  return createTokens(ctx)({
    account,
    authMethodsReference: `${authMethodsReference} otp`,
    client,
    responseType: session.authorization.responseType,
    session: authenticated,
  });
};
