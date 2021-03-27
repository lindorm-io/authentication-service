import Joi from "@hapi/joi";
import { GrantType } from "../../../enum";
import { IKoaAuthContext } from "../../../typing";
import { JOI_CODE_CHALLENGE, JOI_CODE_METHOD, JOI_EMAIL, JOI_GRANT_TYPE, JOI_STATE } from "../../../constant";
import { Scope } from "@lindorm-io/jwt";
import { assertValidScopeInput, assertValidResponseTypeInput } from "../../../util";
import { createAuthorization, getAuthorizationToken, sendEmailLink } from "../../../support";

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

export const performEmailLinkInit = (ctx: IKoaAuthContext) => async (
  options: IPerformEmailLinkInitOptions,
): Promise<IPerformEmailLinkInitData> => {
  await schema.validateAsync(options);

  const { client } = ctx;
  const { codeChallenge, codeMethod, grantType, redirectUri, responseType, state, subject } = options;
  const scope = options.scope.split(" ") as Array<Scope>;

  assertValidResponseTypeInput(responseType);
  assertValidScopeInput(scope);

  const authorization = await createAuthorization(ctx)({
    codeChallenge,
    codeMethod,
    email: subject,
    grantType: GrantType.EMAIL_LINK,
    redirectUri,
    responseType,
    scope,
  });

  const { expires, expiresIn, token } = getAuthorizationToken(ctx)({ authorization, client });

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
