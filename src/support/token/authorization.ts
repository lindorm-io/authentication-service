import { Audience } from "../../enum";
import { Client, Device, Session } from "../../entity";
import { IAuthContext } from "../../typing";
import { ITokenIssuerSignData } from "@lindorm-io/jwt";

export interface IGetAuthorizationTokenOptions {
  client: Client;
  device?: Device;
  session: Session;
}

export const getAuthorizationToken = (ctx: IAuthContext) => (
  options: IGetAuthorizationTokenOptions,
): ITokenIssuerSignData => {
  const { logger, issuer } = ctx;
  const { tokenIssuer } = issuer;
  const { client, device, session } = options;

  logger.debug("creating authorization token", {
    client: client.id,
    device: device?.id,
    session: session.id,
  });

  return tokenIssuer.sign({
    id: session.authorization.id,
    audience: Audience.AUTHORIZATION,
    clientId: client.id,
    deviceId: device?.id,
    expiry: session.expires,
    subject: session.id,
  });
};
