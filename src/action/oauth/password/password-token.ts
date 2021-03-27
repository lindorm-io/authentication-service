import Joi from "@hapi/joi";
import { IKoaAuthContext, ICreateTokensData } from "../../../typing";
import { JOI_EMAIL, JOI_GRANT_TYPE } from "../../../constant";
import {
  assertAccountPassword,
  createSession,
  createTokens,
  getMultiFactorToken,
  validateAuthorization,
} from "../../../support";

export interface IPerformPasswordTokenOptions {
  codeVerifier: string;
  grantType: string;
  password: string;
  subject: string;
}

const schema = Joi.object({
  codeVerifier: Joi.string().required(),
  grantType: JOI_GRANT_TYPE,
  password: Joi.string().required(),
  subject: JOI_EMAIL,
});

export const performPasswordToken = (ctx: IKoaAuthContext) => async (
  options: IPerformPasswordTokenOptions,
): Promise<ICreateTokensData> => {
  await schema.validateAsync(options);

  const { client, repository } = ctx;
  const { codeVerifier, grantType, password, subject } = options;
  const authMethodsReference = ["password"];

  const authorization = await validateAuthorization(ctx)({
    codeVerifier,
    email: subject,
    grantType,
  });

  const account = await repository.account.find({ email: subject });

  await assertAccountPassword(account, password);

  if (account.otp.signature) {
    const multiFactorToken = getMultiFactorToken(ctx)({
      authMethodsReference,
      authorization,
      client,
    });

    return { multiFactorToken };
  }

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
