import Joi from "@hapi/joi";
import { IAuthContext, ICreateTokensData } from "../../../typing";
import { JOI_EMAIL, JOI_GRANT_TYPE } from "../../../constant";
import {
  assertSessionOTP,
  authenticateSession,
  createTokens,
  findOrCreateAccount,
  findValidSession,
} from "../../../support";

export interface IPerformEmailOTPTokenOptions {
  codeVerifier: string;
  grantType: string;
  otpCode: string;
  subject: string;
}

const schema = Joi.object({
  codeVerifier: Joi.string().required(),
  grantType: JOI_GRANT_TYPE,
  otpCode: Joi.string().required(),
  subject: JOI_EMAIL,
});

export const performEmailOTPToken = (ctx: IAuthContext) => async (
  options: IPerformEmailOTPTokenOptions,
): Promise<ICreateTokensData> => {
  await schema.validateAsync(options);

  const { client } = ctx;
  const { codeVerifier, grantType, otpCode, subject } = options;
  const authMethodsReference = "email otp";

  const session = await findValidSession(ctx)({
    codeVerifier,
    grantType,
    subject,
  });

  const account = await findOrCreateAccount(ctx)(session.authorization.email);

  assertSessionOTP(session, otpCode);

  const authenticated = await authenticateSession(ctx)({
    account,
    session,
  });

  return createTokens(ctx)({
    account,
    authMethodsReference,
    client,
    responseType: session.authorization.responseType,
    session: authenticated,
  });
};
