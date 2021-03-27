import Joi from "@hapi/joi";
import { IKoaAuthContext, ICreateTokensData } from "../../../typing";
import { InvalidDeviceError } from "../../../error";
import { JOI_EMAIL, JOI_GRANT_TYPE } from "../../../constant";
import { createSession, createTokens, validateAuthorization } from "../../../support";
import { stringComparison } from "@lindorm-io/core";
import { requestVerifyDeviceSecret } from "../../../axios";

export interface IPerformDeviceSecretTokenOptions {
  certificateVerifier: string;
  codeVerifier: string;
  deviceId: string;
  grantType: string;
  secret: string;
  subject: string;
}

const schema = Joi.object({
  certificateVerifier: Joi.string().required(),
  codeVerifier: Joi.string().required(),
  deviceId: Joi.string().guid().required(),
  grantType: JOI_GRANT_TYPE,
  secret: Joi.string().required(),
  subject: JOI_EMAIL,
});

export const performDeviceSecretToken = (ctx: IKoaAuthContext) => async (
  options: IPerformDeviceSecretTokenOptions,
): Promise<ICreateTokensData> => {
  await schema.validateAsync(options);

  const { client, metadata, repository } = ctx;
  const { certificateVerifier, codeVerifier, deviceId, grantType, secret, subject } = options;
  const authMethodsReference = ["biometrics"];

  if (!stringComparison(deviceId, metadata.deviceId)) {
    throw new InvalidDeviceError(deviceId);
  }

  const authorization = await validateAuthorization(ctx)({
    codeVerifier,
    email: subject,
    grantType,
  });

  const account = await repository.account.find({ email: subject });

  await requestVerifyDeviceSecret({
    account,
    authorization,
    certificateVerifier,
    secret,
  });

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
