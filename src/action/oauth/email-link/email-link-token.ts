import Joi from "@hapi/joi";
import { IKoaAuthContext, ICreateTokensData } from "../../../typing";
import { JOI_EMAIL, JOI_GRANT_TYPE } from "../../../constant";
import { createSession, createTokens, findOrCreateAccount, validateAuthorization } from "../../../support";

export interface IPerformEmailLinkTokenOptions {
  codeVerifier: string;
  grantType: string;
  subject: string;
}

const schema = Joi.object({
  codeVerifier: Joi.string().required(),
  grantType: JOI_GRANT_TYPE,
  subject: JOI_EMAIL,
});

export const performEmailLinkToken = (ctx: IKoaAuthContext) => async (
  options: IPerformEmailLinkTokenOptions,
): Promise<ICreateTokensData> => {
  await schema.validateAsync(options);

  const { client } = ctx;
  const { codeVerifier, grantType, subject } = options;
  const authMethodsReference = ["email"];

  const authorization = await validateAuthorization(ctx)({
    codeVerifier,
    email: subject,
    grantType,
  });

  const account = await findOrCreateAccount(ctx)(subject);

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
