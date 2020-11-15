import Joi from "@hapi/joi";
import { IAuthContext } from "../../../typing";
import { JOI_CODE_CHALLENGE, JOI_CODE_METHOD, JOI_EMAIL, JOI_GRANT_TYPE, JOI_STATE } from "../../../constant";
import { assertValidScopeInput, assertValidResponseTypeInput } from "../../../util";
import { createSession, getAuthorizationToken, sendEmailLink } from "../../../support";

export interface IPerformEmailLinkInitOptions {
  codeChallenge: string;
  codeMethod: string;
  grantType: string;
  redirectUri: string;
  responseType: string;
  scope: string;
  state: string;
  subject: string;
}

export interface IPerformEmailLinkInitData {
  expires: number;
  expiresIn: number;
  state: string;
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

export const performEmailLinkInit = (ctx: IAuthContext) => async (
  options: IPerformEmailLinkInitOptions,
): Promise<IPerformEmailLinkInitData> => {
  await schema.validateAsync(options);

  const { client } = ctx;
  const { codeChallenge, codeMethod, grantType, redirectUri, responseType, scope, state, subject } = options;

  assertValidResponseTypeInput(responseType);
  assertValidScopeInput(scope);

  const session = await createSession(ctx)({
    codeChallenge,
    codeMethod,
    grantType,
    redirectUri,
    responseType,
    scope,
    state,
    subject,
  });

  const { expires, expiresIn, token } = getAuthorizationToken(ctx)({ client, session });

  await sendEmailLink(ctx)({
    grantType,
    redirectUri,
    state,
    subject,
    token,
  });

  return {
    expires,
    expiresIn,
    state,
  };
};
