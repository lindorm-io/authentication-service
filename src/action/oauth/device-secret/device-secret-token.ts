import Joi from "@hapi/joi";
import { IAuthContext, ICreateTokensData } from "../../../typing";
import { JOI_EMAIL, JOI_GRANT_TYPE } from "../../../constant";
import {
  assertDeviceChallenge,
  assertDeviceSecret,
  authenticateSession,
  createTokens,
  findOrCreateAccount,
  findValidSession,
} from "../../../support";
import { DeviceNotFoundError } from "../../../error";

export interface IPerformDeviceSecretTokenOptions {
  codeVerifier: string;
  deviceVerifier: string;
  grantType: string;
  secret: string;
  subject: string;
}

const schema = Joi.object({
  codeVerifier: Joi.string().required(),
  deviceVerifier: Joi.string().required(),
  grantType: JOI_GRANT_TYPE,
  secret: Joi.string().required(),
  subject: JOI_EMAIL,
});

export const performDeviceSecretToken = (ctx: IAuthContext) => async (
  options: IPerformDeviceSecretTokenOptions,
): Promise<ICreateTokensData> => {
  await schema.validateAsync(options);

  const { client, device } = ctx;
  const { codeVerifier, deviceVerifier, grantType, secret, subject } = options;
  const authMethodsReference = "biometrics";

  if (!device) {
    throw new DeviceNotFoundError();
  }

  const session = await findValidSession(ctx)({
    codeVerifier,
    grantType,
    subject,
  });

  const account = await findOrCreateAccount(ctx)(session.authorization.email);

  assertDeviceChallenge(session, device, deviceVerifier);

  await assertDeviceSecret(device, secret);

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
