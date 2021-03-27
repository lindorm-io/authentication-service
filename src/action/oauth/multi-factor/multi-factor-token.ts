import Joi from "@hapi/joi";
import { IKoaAuthContext, ICreateTokensData } from "../../../typing";
import { InvalidClientError } from "@lindorm-io/koa-client";
import { InvalidPermissionError, InvalidSubjectError } from "../../../error";
import { JOI_EMAIL, JOI_GRANT_TYPE } from "../../../constant";
import { assertAccountOTP, assertAuthorizationIsNotExpired, createSession, createTokens } from "../../../support";
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

export const performMultiFactorToken = (ctx: IKoaAuthContext) => async (
  options: IPerformMultiFactorTokenOptions,
): Promise<ICreateTokensData> => {
  await schema.validateAsync(options);

  const { cache, client, repository, token } = ctx;
  const { bindingCode, subject } = options;
  const {
    multiFactor: { authMethodsReference, subject: authorizationId },
  } = token;

  authMethodsReference.push("otp");

  const authorization = await cache.authorization.find(authorizationId);

  assertAuthorizationIsNotExpired(authorization);

  if (authorization.clientId !== client.id) {
    throw new InvalidClientError(client.id);
  }

  if (authorization.email !== subject) {
    throw new InvalidSubjectError(subject);
  }

  const account = await repository.account.find({ email: subject });

  if (isLocked(account.permission)) {
    throw new InvalidPermissionError();
  }

  await assertAccountOTP(account, bindingCode);

  const session = await createSession(ctx)({
    account,
    authorization,
  });

  return createTokens(ctx)({
    account,
    authMethodsReference,
    client,
    responseType: authorization.responseType,
    session,
  });
};
