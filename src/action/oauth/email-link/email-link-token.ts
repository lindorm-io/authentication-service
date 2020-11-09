import Joi from "@hapi/joi";
import { IAuthContext, ICreateTokensData } from "../../../typing";
import { JOI_EMAIL, JOI_GRANT_TYPE } from "../../../constant";
import { authenticateSession, createTokens, findOrCreateAccount, findValidSession } from "../../../support";

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

export const performEmailLinkToken = (ctx: IAuthContext) => async (
  options: IPerformEmailLinkTokenOptions,
): Promise<ICreateTokensData> => {
  await schema.validateAsync(options);

  const { client } = ctx;
  const { codeVerifier, grantType, subject } = options;
  const authMethodsReference = "email@lindorm.io";

  const session = await findValidSession(ctx)({
    codeVerifier,
    grantType,
    subject,
  });

  const account = await findOrCreateAccount(ctx)(session.authorization.email);

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
