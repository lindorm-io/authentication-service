import { Authorization } from "../../entity";
import { GrantType } from "../../enum";
import { IKoaAuthContext } from "../../typing";
import { config } from "../../config";
import { encryptAuthorizationOTP } from "./otp";
import { Scope } from "@lindorm-io/jwt";
import { getExpiryDate } from "../../util";

export interface ICreateAuthorizationOptions {
  challengeId?: string;
  codeChallenge: string;
  codeMethod: string;
  email: string;
  grantType: GrantType;
  otpCode?: string;
  redirectUri: string;
  responseType: string;
  scope: Array<Scope>;
}

export const createAuthorization = (ctx: IKoaAuthContext) => async (
  options: ICreateAuthorizationOptions,
): Promise<Authorization> => {
  const { cache, client, metadata } = ctx;
  const {
    challengeId,
    codeChallenge,
    codeMethod,
    email,
    grantType,
    otpCode,
    redirectUri,
    responseType,
    scope,
  } = options;

  return await cache.authorization.create(
    new Authorization({
      challengeId,
      clientId: client.id,
      codeChallenge,
      codeMethod,
      deviceId: metadata.deviceId,
      email,
      expires: getExpiryDate(config.JWT_AUTHORIZATION_TOKEN_EXPIRY),
      grantType,
      otpCode: otpCode ? encryptAuthorizationOTP(otpCode) : null,
      redirectUri,
      responseType,
      scope,
    }),
  );
};
