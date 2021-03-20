import { Audience } from "../../enum";
import { Client } from "@lindorm-io/koa-client";
import { Session } from "../../entity";
import { IKoaAuthContext } from "../../typing";
import { ITokenIssuerSignData } from "@lindorm-io/jwt";
import { JWT_MULTI_FACTOR_TOKEN_EXPIRY } from "../../config";

export interface IGetMultiFactorTokenOptions {
  authMethodsReference: string;
  client: Client;
  session: Session;
}

export const getMultiFactorToken = (ctx: IKoaAuthContext) => (
  options: IGetMultiFactorTokenOptions,
): ITokenIssuerSignData => {
  const { logger, issuer, metadata } = ctx;
  const { tokenIssuer } = issuer;
  const { authMethodsReference, client, session } = options;

  logger.debug("creating multi factor token", {
    client: client.id,
    device: metadata.deviceId,
    session: session.id,
  });

  return tokenIssuer.sign({
    audience: Audience.MULTI_FACTOR,
    authMethodsReference: authMethodsReference,
    clientId: client.id,
    deviceId: metadata.deviceId,
    expiry: client?.extra?.jwtMultiFactorTokenExpiry || JWT_MULTI_FACTOR_TOKEN_EXPIRY,
    subject: session.id,
  });
};
