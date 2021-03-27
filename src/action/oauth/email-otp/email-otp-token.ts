import Joi from "@hapi/joi";
import { IKoaAuthContext, ICreateTokensData } from "../../../typing";
import { JOI_EMAIL, JOI_GRANT_TYPE } from "../../../constant";
import {
  assertAuthorizationOTP,
  createSession,
  createTokens,
  findOrCreateAccount,
  validateAuthorization,
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

export const performEmailOTPToken = (ctx: IKoaAuthContext) => async (
  options: IPerformEmailOTPTokenOptions,
): Promise<ICreateTokensData> => {
  await schema.validateAsync(options);

  const { client } = ctx;
  const { codeVerifier, grantType, otpCode, subject } = options;
  const authMethodsReference = ["email", "otp"];

  const authorization = await validateAuthorization(ctx)({
    codeVerifier,
    email: subject,
    grantType,
  });

  const account = await findOrCreateAccount(ctx)(subject);

  assertAuthorizationOTP(authorization, otpCode);

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
