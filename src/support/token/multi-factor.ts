import { Audience } from "../../enum";
import { Client } from "@lindorm-io/koa-client";
import { Device, Session } from "../../entity";
import { IAuthContext } from "../../typing";
import { ITokenIssuerSignData } from "@lindorm-io/jwt";
import { JWT_MULTI_FACTOR_TOKEN_EXPIRY } from "../../config";

export interface IGetMultiFactorTokenOptions {
  authMethodsReference: string;
  client: Client;
  device?: Device;
  session: Session;
}

export const getMultiFactorToken = (ctx: IAuthContext) => (
  options: IGetMultiFactorTokenOptions,
): ITokenIssuerSignData => {
  const { logger, issuer } = ctx;
  const { tokenIssuer } = issuer;
  const { authMethodsReference, client, device, session } = options;

  logger.debug("creating multi factor token", {
    client: client.id,
    device: device?.id,
    session: session.id,
  });

  return tokenIssuer.sign({
    audience: Audience.MULTI_FACTOR,
    authMethodsReference: authMethodsReference,
    clientId: client.id,
    deviceId: device?.id,
    expiry: client?.extra?.jwtMultiFactorTokenExpiry || JWT_MULTI_FACTOR_TOKEN_EXPIRY,
    subject: session.id,
  });
};
