import Joi from "@hapi/joi";
import { IKoaAuthContext, ICreateTokensData } from "../../../typing";
import { JOI_EMAIL, JOI_GRANT_TYPE } from "../../../constant";
import {
  assertAccountPassword,
  authenticateSession,
  createTokens,
  findValidSession,
  getMultiFactorToken,
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
  const authMethodsReference = "password";

  const session = await findValidSession(ctx)({
    codeVerifier,
    grantType,
    subject,
  });

  const account = await repository.account.find({ email: subject });

  await assertAccountPassword(account, password);

  if (account.otp.signature) {
    const multiFactorToken = getMultiFactorToken(ctx)({
      authMethodsReference,
      client,
      session,
    });

    return { multiFactorToken };
  }

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
