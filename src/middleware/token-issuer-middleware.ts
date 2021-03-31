import { AUTH_KEYSTORE_NAME, AUTH_TOKEN_ISSUER } from "../constant";
import { config } from "../config";
import { tokenIssuerMiddleware as _tokenIssuerMiddleware } from "@lindorm-io/koa-jwt";

export const tokenIssuerMiddleware = _tokenIssuerMiddleware({
  issuer: config.JWT_ISSUER,
  issuerName: AUTH_TOKEN_ISSUER,
  keystoreName: AUTH_KEYSTORE_NAME,
});
