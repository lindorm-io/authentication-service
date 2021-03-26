import { IKoaAuthContext } from "../../typing";
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
  scope: Array<string>;
  state: string;
  subject: string;
}

export const createSession = (ctx: IKoaAuthContext) => async (options: ICreateSessionOptions): Promise<Session> => {
  const { client, metadata, repository, userAgent } = ctx;
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

  const expires = client.extra?.jwtAuthorizationTokenExpiry || JWT_AUTHORIZATION_TOKEN_EXPIRY;

  return await repository.session.create(
    new Session({
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
      deviceId: metadata.deviceId,
      expires: getSessionExpires(expires),
      grantType,
      scope,
    }),
  );
};
