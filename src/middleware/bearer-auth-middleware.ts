import { config } from "../config";
import { bearerAuthMiddleware as _bearerAuthMiddleware } from "@lindorm-io/koa-bearer-auth";
import { AUTH_TOKEN_ISSUER } from "../constant";
import { Audience } from "../enum";

export const bearerAuthMiddleware = _bearerAuthMiddleware({
  issuer: config.JWT_ISSUER,
  issuerName: AUTH_TOKEN_ISSUER,
  audience: Audience.ACCESS,
});
