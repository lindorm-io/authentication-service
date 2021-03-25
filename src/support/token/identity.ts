import { Account } from "../../entity";
import { Audience } from "../../enum";
import { Client } from "@lindorm-io/koa-client";
import { IKoaAuthContext } from "../../typing";
import { ITokenIssuerSignData } from "@lindorm-io/jwt";
import { JWT_IDENTITY_TOKEN_EXPIRY } from "../../config";
import { getOpenIdClaims } from "../../axios";

export interface IGetIdentityTokenOptions {
  account: Account;
  client: Client;
  scope: string;
}

export const getIdentityToken = (ctx: IKoaAuthContext) => async (
  options: IGetIdentityTokenOptions,
): Promise<ITokenIssuerSignData> => {
  const { logger, issuer, metadata } = ctx;
  const { tokenIssuer } = issuer;
  const { account, client, scope } = options;

  logger.debug("creating identity token", {
    client: client.id,
    device: metadata.deviceId,
    account: account.id,
  });

  const payload = await getOpenIdClaims(account, scope);

  return tokenIssuer.sign({
    audience: Audience.IDENTITY,
    clientId: client.id,
    deviceId: metadata.deviceId,
    expiry: JWT_IDENTITY_TOKEN_EXPIRY,
    subject: account.id,
    payload,
  });
};
