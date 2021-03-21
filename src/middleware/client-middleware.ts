import { CRYPTO_SECRET_OPTIONS } from "../config";
import { cachedClientMiddleware } from "@lindorm-io/koa-client";

export const clientMiddleware = cachedClientMiddleware(CRYPTO_SECRET_OPTIONS);
