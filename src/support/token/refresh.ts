import { Account, Device, Session } from "../../entity";
import { Audience } from "../../enum";
import { Client } from "@lindorm-io/koa-client";
import { IAuthContext } from "../../typing";
import { ITokenIssuerSignData } from "@lindorm-io/jwt";

export interface IGetRefreshTokenOptions {
  account: Account;
  authMethodsReference: string;
  client: Client;
  device?: Device;
  scope: string;
  session: Session;
}

export const getRefreshToken = (ctx: IAuthContext) => (options: IGetRefreshTokenOptions): ITokenIssuerSignData => {
  const { logger, issuer } = ctx;
  const { tokenIssuer } = issuer;
  const { authMethodsReference, client, device, account, scope, session } = options;

  logger.debug("creating refresh token", {
    account: account.id,
    client: client.id,
    device: device?.id,
    scope,
    session: session.id,
  });

  return tokenIssuer.sign({
    audience: Audience.REFRESH,
    authMethodsReference: authMethodsReference,
    clientId: client.id,
    deviceId: device?.id,
    expiry: session.expires,
    id: session.refreshId,
    permission: account.permission,
    scope,
    subject: session.id,
  });
};
