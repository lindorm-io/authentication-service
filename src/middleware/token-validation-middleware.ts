import { Audience } from "../enum";
import { IKoaAuthContext, TNext } from "../typing";
import { isString } from "lodash";
import { sanitiseToken } from "@lindorm-io/jwt";

export const tokenValidationMiddleware = async (ctx: IKoaAuthContext, next: TNext): Promise<any> => {
  const start = Date.now();

  const { issuer, logger, metadata } = ctx;
  const { tokenIssuer } = issuer;
  const { authorizationToken, multiFactorToken, refreshToken } = ctx.request.body;

  if (isString(authorizationToken)) {
    const verified = tokenIssuer.verify({
      audience: Audience.AUTHORIZATION,
      clientId: metadata.clientId,
      deviceId: metadata.deviceId,
      token: authorizationToken,
    });

    ctx.token = {
      ...(ctx.token || {}),
      authorization: verified,
    };
  }

  if (isString(multiFactorToken)) {
    const verified = tokenIssuer.verify({
      audience: Audience.MULTI_FACTOR,
      clientId: metadata.clientId,
      deviceId: metadata.deviceId,
      token: multiFactorToken,
    });

    ctx.token = {
      ...(ctx.token || {}),
      multiFactor: verified,
    };
  }

  if (isString(refreshToken)) {
    const verified = tokenIssuer.verify({
      audience: Audience.REFRESH,
      clientId: metadata.clientId,
      deviceId: metadata.deviceId,
      token: refreshToken,
    });

    ctx.token = {
      ...(ctx.token || {}),
      refresh: verified,
    };
  }

  logger.debug("tokens validated", {
    authorization: sanitiseToken(authorizationToken),
    multiFactor: sanitiseToken(multiFactorToken),
    refresh: sanitiseToken(refreshToken),
  });

  ctx.metrics = {
    ...(ctx.metrics || {}),
    tokenValidation: Date.now() - start,
  };

  await next();
};
