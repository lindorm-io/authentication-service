import Joi from "@hapi/joi";
import { IAuthContext } from "../../../typing";
import { JOI_CODE_CHALLENGE, JOI_CODE_METHOD, JOI_EMAIL, JOI_GRANT_TYPE, JOI_STATE } from "../../../constant";
import { assertValidScopeInput, assertValidResponseTypeInput } from "../../../util";
import { createSession, getAuthorizationToken, sendEmailOTP } from "../../../support";
import { getRandomNumber } from "@lindorm-io/core";

export interface IPerformEmailOTPInitOptions {
  codeChallenge: string;
  codeMethod: string;
  grantType: string;
  redirectUri: string;
  responseType: string;
  scope: string;
  state: string;
  subject: string;
}

export interface IPerformEmailOTPInitData {
  expires: number;
  expiresIn: number;
  redirectUri: string;
  state: string;
  token: string;
}

const schema = Joi.object({
  codeChallenge: JOI_CODE_CHALLENGE,
  codeMethod: JOI_CODE_METHOD,
  grantType: JOI_GRANT_TYPE,
  redirectUri: Joi.string().uri().required(),
  responseType: Joi.string().required(),
  scope: Joi.string().required(),
  state: JOI_STATE,
  subject: JOI_EMAIL,
});

export const performEmailOTPInit = (ctx: IAuthContext) => async (
  options: IPerformEmailOTPInitOptions,
): Promise<IPerformEmailOTPInitData> => {
  await schema.validateAsync(options);

  const { client } = ctx;
  const { codeChallenge, codeMethod, grantType, redirectUri, responseType, scope, state, subject } = options;

  assertValidResponseTypeInput(responseType);
  assertValidScopeInput(scope);

  const otpCode = await getRandomNumber(6);

  const session = await createSession(ctx)({
    codeChallenge,
    codeMethod,
    grantType,
    otpCode,
    redirectUri,
    responseType,
    scope,
    state,
    subject,
  });

  const { expires, expiresIn, token } = getAuthorizationToken(ctx)({ client, session });

  await sendEmailOTP(ctx)({ otpCode, subject });

  return {
    expires,
    expiresIn,
    redirectUri,
    state,
    token,
  };
};
