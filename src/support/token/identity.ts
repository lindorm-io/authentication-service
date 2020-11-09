import { Account, Client, Device } from "../../entity";
import { IAuthContext } from "../../typing";
import { Audience } from "../../enum";
import { JWT_IDENTITY_TOKEN_EXPIRY } from "../../config";
import { ITokenIssuerSignData } from "@lindorm-io/jwt";
import { TObject } from "@lindorm-io/core";

export interface IGetIdentityTokenOptions {
  account: Account;
  client: Client;
  device?: Device;
  payload: TObject<any>;
}

export const getIdentityToken = (ctx: IAuthContext) => (options: IGetIdentityTokenOptions): ITokenIssuerSignData => {
  const { logger, issuer } = ctx;
  const { tokenIssuer } = issuer;
  const { account, client, device, payload } = options;

  logger.debug("creating identity token", {
    client: client.id,
    device: device?.id,
    account: account.id,
  });

  return tokenIssuer.sign({
    audience: Audience.IDENTITY,
    clientId: client.id,
    deviceId: device?.id,
    expiry: JWT_IDENTITY_TOKEN_EXPIRY,
    subject: account.id,
    payload,
  });
};
