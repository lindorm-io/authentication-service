import { Account } from "../../entity";
import { Audience } from "../../enum";
import { Client } from "@lindorm-io/koa-client";
import { IKoaAuthContext } from "../../typing";
import { ITokenIssuerSignData } from "@lindorm-io/jwt";
import { config } from "../../config";

export interface IGetAccessTokenOptions {
  account: Account;
  authMethodsReference: Array<string>;
  client: Client;
  scope: Array<string>;
}

export const getAccessToken = (ctx: IKoaAuthContext) => (options: IGetAccessTokenOptions): ITokenIssuerSignData => {
  const { logger, issuer, metadata } = ctx;
  const { account, authMethodsReference, client, scope } = options;

  logger.debug("creating access token", {
    client: client.id,
    device: metadata.deviceId,
    account: account.id,
    scope,
  });

  return issuer.auth.sign({
    audience: Audience.ACCESS,
    authMethodsReference: authMethodsReference,
    clientId: client.id,
    deviceId: metadata.deviceId,
    expiry: client?.extra?.jwtAccessTokenExpiry || config.JWT_ACCESS_TOKEN_EXPIRY,
    permission: account.permission,
    scope,
    subject: account.id,
  });
};
