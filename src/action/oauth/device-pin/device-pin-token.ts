import Joi from "@hapi/joi";
import { IKoaAuthContext, ICreateTokensData } from "../../../typing";
import { InvalidDeviceError } from "../../../error";
import { JOI_EMAIL, JOI_GRANT_TYPE } from "../../../constant";
import { createSession, createTokens, validateAuthorization } from "../../../support";
import { stringComparison } from "@lindorm-io/core";
import { requestVerifyDevicePIN } from "../../../axios";

export interface IPerformDevicePINTokenOptions {
  certificateVerifier: string;
  codeVerifier: string;
  deviceId: string;
  grantType: string;
  pin: string;
  subject: string;
}

const schema = Joi.object({
  certificateVerifier: Joi.string().required(),
  codeVerifier: Joi.string().required(),
  deviceId: Joi.string().guid().required(),
  grantType: JOI_GRANT_TYPE,
  pin: Joi.string().required(),
  subject: JOI_EMAIL,
});

export const performDevicePINToken = (ctx: IKoaAuthContext) => {
  return async (options: IPerformDevicePINTokenOptions): Promise<ICreateTokensData> => {
    await schema.validateAsync(options);

    const { client, metadata, repository } = ctx;
    const { certificateVerifier, codeVerifier, deviceId, grantType, pin, subject } = options;
    const authMethodsReference = ["pin"];

    if (!stringComparison(deviceId, metadata.deviceId)) {
      throw new InvalidDeviceError(deviceId);
    }

    const authorization = await validateAuthorization(ctx)({
      codeVerifier,
      email: subject,
      grantType,
    });

    const account = await repository.account.find({ email: subject });

    await requestVerifyDevicePIN(ctx)({
      account,
      authorization,
      certificateVerifier,
      pin,
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
};
