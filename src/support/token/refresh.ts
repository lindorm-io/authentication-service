import { Account, Session } from "../../entity";
import { Audience } from "../../enum";
import { Client } from "@lindorm-io/koa-client";
import { IKoaAuthContext } from "../../typing";
import { ITokenIssuerSignData } from "@lindorm-io/jwt";

export interface IGetRefreshTokenOptions {
  account: Account;
  authMethodsReference: string;
  client: Client;
  scope: string;
  session: Session;
}

export const getRefreshToken = (ctx: IKoaAuthContext) => (options: IGetRefreshTokenOptions): ITokenIssuerSignData => {
  const { logger, issuer, metadata } = ctx;
  const { tokenIssuer } = issuer;
  const { authMethodsReference, client, account, scope, session } = options;

  logger.debug("creating refresh token", {
    account: account.id,
    client: client.id,
    device: metadata.deviceId,
    scope,
    session: session.id,
  });

  return tokenIssuer.sign({
    audience: Audience.REFRESH,
    authMethodsReference: authMethodsReference,
    clientId: client.id,
    deviceId: metadata.deviceId,
    expiry: session.expires,
    id: session.refreshId,
    permission: account.permission,
    scope,
    subject: session.id,
  });
};
