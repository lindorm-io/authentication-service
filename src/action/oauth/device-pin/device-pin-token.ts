import Joi from "@hapi/joi";
import { IAuthContext, ICreateTokensData } from "../../../typing";
import { JOI_EMAIL, JOI_GRANT_TYPE } from "../../../constant";
import {
  assertDeviceChallenge,
  assertDevicePIN,
  authenticateSession,
  createTokens,
  findOrCreateAccount,
  findValidSession,
} from "../../../support";
import { DeviceNotFoundError } from "../../../error";

export interface IPerformDevicePINTokenOptions {
  codeVerifier: string;
  deviceVerifier: string;
  grantType: string;
  pin: string;
  subject: string;
}

const schema = Joi.object({
  codeVerifier: Joi.string().required(),
  deviceVerifier: Joi.string().required(),
  grantType: JOI_GRANT_TYPE,
  pin: Joi.string().required(),
  subject: JOI_EMAIL,
});

export const performDevicePINToken = (ctx: IAuthContext) => async (
  options: IPerformDevicePINTokenOptions,
): Promise<ICreateTokensData> => {
  await schema.validateAsync(options);

  const { client, device } = ctx;
  const { codeVerifier, deviceVerifier, grantType, pin, subject } = options;
  const authMethodsReference = "pin";

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

  await assertDevicePIN(device, pin);

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
