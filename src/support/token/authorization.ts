import { Audience } from "../../enum";
import { Client } from "@lindorm-io/koa-client";
import { Session } from "../../entity";
import { IKoaAuthContext } from "../../typing";
import { ITokenIssuerSignData } from "@lindorm-io/jwt";

export interface IGetAuthorizationTokenOptions {
  client: Client;
  session: Session;
}

export const getAuthorizationToken = (ctx: IKoaAuthContext) => (
  options: IGetAuthorizationTokenOptions,
): ITokenIssuerSignData => {
  const { logger, issuer, metadata } = ctx;
  const { tokenIssuer } = issuer;
  const { client, session } = options;

  logger.debug("creating authorization token", {
    client: client.id,
    device: metadata.deviceId,
    session: session.id,
  });

  return tokenIssuer.sign({
    id: session.authorization.id,
    audience: Audience.AUTHORIZATION,
    clientId: client.id,
    deviceId: metadata.deviceId,
    expiry: session.expires,
    subject: session.id,
  });
};
