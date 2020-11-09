import { IAuthContext } from "../../typing";
import { JWT_AUTHORIZATION_TOKEN_EXPIRY } from "../../config";
import { Session } from "../../entity";
import { encryptSessionOTP } from "./otp";
import { getSessionExpires } from "./expires";
import { v4 as uuid } from "uuid";

export interface ICreateSessionOptions {
  codeChallenge: string;
  codeMethod: string;
  grantType: string;
  redirectUri: string;
  responseType: string;
  deviceChallenge?: string;
  otpCode?: string;
  scope: string;
  state: string;
  subject: string;
}

export const createSession = (ctx: IAuthContext) => async (options: ICreateSessionOptions): Promise<Session> => {
  const { client, device, repository, userAgent } = ctx;
  const {
    codeChallenge,
    codeMethod,
    deviceChallenge,
    grantType,
    otpCode,
    redirectUri,
    responseType,
    scope,
    subject,
  } = options;

  const session = new Session({
    agent: userAgent,
    authorization: {
      codeChallenge,
      codeMethod,
      deviceChallenge,
      email: subject,
      id: uuid(),
      otpCode: otpCode ? encryptSessionOTP(otpCode) : null,
      redirectUri,
      responseType,
    },
    clientId: client.id,
    deviceId: device?.id,
    expires: getSessionExpires(JWT_AUTHORIZATION_TOKEN_EXPIRY),
    grantType,
    scope,
  });
  session.create();

  return await repository.session.create(session);
};
