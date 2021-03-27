import { Audience } from "../../enum";
import { Client } from "@lindorm-io/koa-client";
import { Authorization } from "../../entity";
import { IKoaAuthContext } from "../../typing";
import { ITokenIssuerSignData } from "@lindorm-io/jwt";

export interface IGetAuthorizationTokenOptions {
  authorization: Authorization;
  client: Client;
}

export const getAuthorizationToken = (ctx: IKoaAuthContext) => (
  options: IGetAuthorizationTokenOptions,
): ITokenIssuerSignData => {
  const { logger, issuer, metadata } = ctx;
  const { tokenIssuer } = issuer;
  const { authorization, client } = options;

  logger.debug("creating authorization token", {
    authorization: authorization.id,
    client: client.id,
    device: metadata.deviceId,
  });

  return tokenIssuer.sign({
    id: authorization.id,
    audience: Audience.AUTHORIZATION,
    clientId: client.id,
    deviceId: metadata.deviceId,
    expiry: authorization.expires,
    subject: authorization.subject,
  });
};
