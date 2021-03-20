import { Client } from "@lindorm-io/koa-client";
import { IKoaAuthContext } from "../../typing";
import { ITokenIssuerVerifyData } from "@lindorm-io/jwt";
import { JWT_ISSUER } from "../../config";

export interface IGetDecodedTokenOptions {
  audience: string;
  client?: Client;
  token: string;
}

export const verifyToken = (ctx: IKoaAuthContext) => (options: IGetDecodedTokenOptions): ITokenIssuerVerifyData => {
  const { logger, issuer, metadata } = ctx;
  const { tokenIssuer } = issuer;
  const { audience, client, token } = options;

  logger.debug("decoding token", {
    audience,
    client: client?.id,
    device: metadata.deviceId,
    token,
  });

  return tokenIssuer.verify({
    audience,
    clientId: client?.id,
    deviceId: metadata.deviceId,
    issuer: JWT_ISSUER,
    token,
  });
};
