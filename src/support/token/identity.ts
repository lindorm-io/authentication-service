import { Account } from "../../entity";
import { Audience } from "../../enum";
import { Client } from "@lindorm-io/koa-client";
import { IKoaAuthContext } from "../../typing";
import { ITokenIssuerSignData } from "@lindorm-io/jwt";
import { JWT_IDENTITY_TOKEN_EXPIRY } from "../../config";
import { TObject } from "@lindorm-io/core";

export interface IGetIdentityTokenOptions {
  account: Account;
  client: Client;
  payload: TObject<any>;
}

export const getIdentityToken = (ctx: IKoaAuthContext) => (options: IGetIdentityTokenOptions): ITokenIssuerSignData => {
  const { logger, issuer, metadata } = ctx;
  const { tokenIssuer } = issuer;
  const { account, client, payload } = options;

  logger.debug("creating identity token", {
    client: client.id,
    device: metadata.deviceId,
    account: account.id,
  });

  return tokenIssuer.sign({
    audience: Audience.IDENTITY,
    clientId: client.id,
    deviceId: metadata.deviceId,
    expiry: JWT_IDENTITY_TOKEN_EXPIRY,
    subject: account.id,
    payload,
  });
};
