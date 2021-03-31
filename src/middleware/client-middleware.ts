import { config } from "../config";
import { cachedClientMiddleware } from "@lindorm-io/koa-client";

export const clientMiddleware = cachedClientMiddleware({
  aesSecret: config.CRYPTO_AES_SECRET,
  shaSecret: config.CRYPTO_SHA_SECRET,
});
