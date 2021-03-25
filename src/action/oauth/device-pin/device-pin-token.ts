import Joi from "@hapi/joi";
import { IKoaAuthContext, ICreateTokensData } from "../../../typing";
import { InvalidDeviceError } from "../../../error";
import { JOI_EMAIL, JOI_GRANT_TYPE } from "../../../constant";
import { authenticateSession, createTokens, findValidSession } from "../../../support";
import { stringComparison } from "@lindorm-io/core";
import { requestVerifyDevicePIN } from "../../../axios";

export interface IPerformDevicePINTokenOptions {
  codeVerifier: string;
  deviceId: string;
  deviceVerifier: string;
  grantType: string;
  pin: string;
  subject: string;
}

const schema = Joi.object({
  codeVerifier: Joi.string().required(),
  deviceId: Joi.string().guid().required(),
  deviceVerifier: Joi.string().required(),
  grantType: JOI_GRANT_TYPE,
  pin: Joi.string().required(),
  subject: JOI_EMAIL,
});

export const performDevicePINToken = (ctx: IKoaAuthContext) => {
  return async (options: IPerformDevicePINTokenOptions): Promise<ICreateTokensData> => {
    await schema.validateAsync(options);

    const { client, metadata, repository } = ctx;
    const { codeVerifier, deviceId, deviceVerifier, grantType, pin, subject } = options;
    const authMethodsReference = "pin";

    if (!stringComparison(deviceId, metadata.deviceId)) {
      throw new InvalidDeviceError(deviceId);
    }

    const session = await findValidSession(ctx)({
      codeVerifier,
      grantType,
      subject,
    });

    const account = await repository.account.find({ email: session.authorization.email });

    await requestVerifyDevicePIN({
      account,
      deviceVerifier,
      pin,
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
};
