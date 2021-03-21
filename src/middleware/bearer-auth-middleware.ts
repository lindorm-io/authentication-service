import { BEARER_AUTH_MW_OPTIONS } from "../config";
import { bearerAuthMiddleware as _bearerAuthMiddleware } from "@lindorm-io/koa-bearer-auth";

export const bearerAuthMiddleware = _bearerAuthMiddleware(BEARER_AUTH_MW_OPTIONS);
