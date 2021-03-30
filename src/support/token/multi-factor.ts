import { Audience } from "../../enum";
import { Authorization } from "../../entity";
import { Client } from "@lindorm-io/koa-client";
import { IKoaAuthContext } from "../../typing";
import { ITokenIssuerSignData } from "@lindorm-io/jwt";
import { JWT_MULTI_FACTOR_TOKEN_EXPIRY } from "../../config";

export interface IGetMultiFactorTokenOptions {
  authMethodsReference: Array<string>;
  authorization: Authorization;
  client: Client;
}

export const getMultiFactorToken = (ctx: IKoaAuthContext) => (
  options: IGetMultiFactorTokenOptions,
): ITokenIssuerSignData => {
  const { logger, issuer, metadata } = ctx;
  const { authMethodsReference, client, authorization } = options;

  logger.debug("creating multi factor token", {
    authorization: authorization.id,
    client: client.id,
    device: metadata.deviceId,
  });

  return issuer.auth.sign({
    audience: Audience.MULTI_FACTOR,
    authMethodsReference: authMethodsReference,
    clientId: client.id,
    deviceId: metadata.deviceId,
    expiry: client?.extra?.jwtMultiFactorTokenExpiry || JWT_MULTI_FACTOR_TOKEN_EXPIRY,
    subject: authorization.id,
  });
};
