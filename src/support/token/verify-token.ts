import { Client } from "@lindorm-io/koa-client";
import { Device } from "../../entity";
import { IAuthContext } from "../../typing";
import { ITokenIssuerVerifyData } from "@lindorm-io/jwt";
import { JWT_ISSUER } from "../../config";

export interface IGetDecodedTokenOptions {
  audience: string;
  client?: Client;
  device?: Device;
  token: string;
}

export const verifyToken = (ctx: IAuthContext) => (options: IGetDecodedTokenOptions): ITokenIssuerVerifyData => {
  const { logger, issuer } = ctx;
  const { tokenIssuer } = issuer;
  const { audience, client, device, token } = options;

  logger.debug("decoding token", {
    audience,
    client: client?.id,
    device: device?.id,
    token,
  });

  return tokenIssuer.verify({
    audience,
    clientId: client?.id,
    deviceId: device?.id,
    issuer: JWT_ISSUER,
    token,
  });
};
