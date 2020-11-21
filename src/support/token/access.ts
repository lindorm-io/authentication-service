import { Account, Device } from "../../entity";
import { Audience } from "../../enum";
import { Client } from "@lindorm-io/koa-client";
import { IAuthContext } from "../../typing";
import { ITokenIssuerSignData } from "@lindorm-io/jwt";
import { JWT_ACCESS_TOKEN_EXPIRY } from "../../config";

export interface IGetAccessTokenOptions {
  account: Account;
  authMethodsReference: string;
  client: Client;
  device?: Device;
  scope: string;
}

export const getAccessToken = (ctx: IAuthContext) => (options: IGetAccessTokenOptions): ITokenIssuerSignData => {
  const { logger, issuer } = ctx;
  const { tokenIssuer } = issuer;
  const { account, authMethodsReference, client, device, scope } = options;

  logger.debug("creating access token", {
    client: client.id,
    device: device?.id,
    account: account.id,
    scope,
  });

  return tokenIssuer.sign({
    audience: Audience.ACCESS,
    authMethodsReference: authMethodsReference,
    clientId: client.id,
    deviceId: device?.id,
    expiry: JWT_ACCESS_TOKEN_EXPIRY,
    permission: account.permission,
    scope,
    subject: account.id,
  });
};
