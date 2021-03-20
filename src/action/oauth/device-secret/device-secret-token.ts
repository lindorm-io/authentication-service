import Joi from "@hapi/joi";
import { IKoaAuthContext, ICreateTokensData } from "../../../typing";
import { InvalidDeviceError } from "../../../error";
import { JOI_EMAIL, JOI_GRANT_TYPE } from "../../../constant";
import { authenticateSession, createTokens, findValidSession } from "../../../support";
import { stringComparison } from "@lindorm-io/core";
import { verifyDeviceSecret } from "../../../axios";

export interface IPerformDeviceSecretTokenOptions {
  codeVerifier: string;
  deviceId: string;
  deviceVerifier: string;
  grantType: string;
  secret: string;
  subject: string;
}

const schema = Joi.object({
  codeVerifier: Joi.string().required(),
  deviceId: Joi.string().guid().required(),
  deviceVerifier: Joi.string().required(),
  grantType: JOI_GRANT_TYPE,
  secret: Joi.string().required(),
  subject: JOI_EMAIL,
});

export const performDeviceSecretToken = (ctx: IKoaAuthContext) => async (
  options: IPerformDeviceSecretTokenOptions,
): Promise<ICreateTokensData> => {
  await schema.validateAsync(options);

  const { client, metadata, repository } = ctx;
  const { codeVerifier, deviceId, deviceVerifier, grantType, secret, subject } = options;
  const authMethodsReference = "biometrics";

  if (!stringComparison(deviceId, metadata.deviceId)) {
    throw new InvalidDeviceError(deviceId);
  }

  const session = await findValidSession(ctx)({
    codeVerifier,
    grantType,
    subject,
  });

  const account = await repository.account.find({ email: session.authorization.email });

  await verifyDeviceSecret({
    account,
    deviceVerifier,
    secret,
    session,
  });

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
