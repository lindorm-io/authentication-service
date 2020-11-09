import { Audience } from "../enum";
import { IAuthContext } from "../typing";
import { TPromise } from "@lindorm-io/core";
import { isString } from "lodash";
import { sanitiseToken } from "@lindorm-io/jwt";

export const tokenValidationMiddleware = async (ctx: IAuthContext, next: TPromise<void>): Promise<any> => {
  const start = Date.now();

  const { client, device, issuer, logger } = ctx;
  const { tokenIssuer } = issuer;
  const { authorizationToken, multiFactorToken, refreshToken } = ctx.request.body;

  if (isString(authorizationToken)) {
    const verified = tokenIssuer.verify({
      audience: Audience.AUTHORIZATION,
      clientId: client.id,
      deviceId: device?.id,
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
      clientId: client.id,
      deviceId: device?.id,
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
      clientId: client.id,
      deviceId: device?.id,
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
