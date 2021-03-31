import { Account } from "../../entity";
import { Audience } from "../../enum";
import { Client } from "@lindorm-io/koa-client";
import { IKoaAuthContext } from "../../typing";
import { ITokenIssuerSignData } from "@lindorm-io/jwt";
import { config } from "../../config";
import { requestOpenIdClaims } from "../../axios";

export interface IGetIdentityTokenOptions {
  account: Account;
  client: Client;
  scope: Array<string>;
}

export const getIdentityToken = (ctx: IKoaAuthContext) => async (
  options: IGetIdentityTokenOptions,
): Promise<ITokenIssuerSignData> => {
  const { logger, issuer, metadata } = ctx;
  const { account, client, scope } = options;

  logger.debug("creating identity token", {
    client: client.id,
    device: metadata.deviceId,
    account: account.id,
  });

  const payload = await requestOpenIdClaims(ctx)(account, scope);

  return issuer.auth.sign({
    audience: Audience.IDENTITY,
    clientId: client.id,
    deviceId: metadata.deviceId,
    expiry: config.JWT_IDENTITY_TOKEN_EXPIRY,
    subject: account.id,
    payload,
  });
};
