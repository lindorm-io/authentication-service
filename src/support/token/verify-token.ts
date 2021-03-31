import { Client } from "@lindorm-io/koa-client";
import { IKoaAuthContext } from "../../typing";
import { ITokenIssuerVerifyData } from "@lindorm-io/jwt";
import { config } from "../../config";

export interface IGetDecodedTokenOptions {
  audience: string;
  client?: Client;
  token: string;
}

export const verifyToken = (ctx: IKoaAuthContext) => (options: IGetDecodedTokenOptions): ITokenIssuerVerifyData => {
  const { logger, issuer, metadata } = ctx;
  const { audience, client, token } = options;

  logger.debug("decoding token", {
    audience,
    client: client?.id,
    device: metadata.deviceId,
    token,
  });

  return issuer.auth.verify({
    audience,
    clientId: client?.id,
    deviceId: metadata.deviceId,
    issuer: config.JWT_ISSUER,
    token,
  });
};
