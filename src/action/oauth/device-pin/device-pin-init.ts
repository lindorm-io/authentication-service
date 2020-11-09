import Joi from "@hapi/joi";
import { IAuthContext } from "../../../typing";
import { JOI_CODE_CHALLENGE, JOI_CODE_METHOD, JOI_EMAIL, JOI_GRANT_TYPE, JOI_STATE } from "../../../constant";
import { assertResponseType } from "../../../util";
import { createSession, getAuthorizationToken } from "../../../support";
import { getRandomValue } from "@lindorm-io/core";
import { DeviceNotFoundError } from "../../../error";

export interface IPerformDevicePINInitOptions {
  codeChallenge: string;
  codeMethod: string;
  grantType: string;
  redirectUri: string;
  responseType: string;
  scope: string;
  state: string;
  subject: string;
}

export interface IPerformDevicePINInitData {
  deviceChallenge: string;
  expires: number;
  expiresIn: number;
  redirectUri: string;
  state: string;
  token: string;
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

export const performDevicePINInit = (ctx: IAuthContext) => async (
  options: IPerformDevicePINInitOptions,
): Promise<IPerformDevicePINInitData> => {
  await schema.validateAsync(options);

  const { client, device } = ctx;
  const { codeChallenge, codeMethod, grantType, redirectUri, responseType, scope, state, subject } = options;

  if (!device) {
    throw new DeviceNotFoundError();
  }

  assertResponseType(responseType);

  const deviceChallenge = getRandomValue(32);

  const session = await createSession(ctx)({
    codeChallenge,
    codeMethod,
    deviceChallenge,
    grantType,
    redirectUri,
    responseType,
    scope,
    state,
    subject,
  });

  const { expires, expiresIn, token } = getAuthorizationToken(ctx)({ client, device, session });

  return {
    deviceChallenge,
    expires,
    expiresIn,
    redirectUri,
    state,
    token,
  };
};
