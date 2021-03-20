import { CLIENT_CACHE_WORKER_OPTIONS, SERVER_PORT, TOKEN_ISSUER_MW_OPTIONS } from "../config";
import { KoaApp } from "@lindorm-io/koa";
import { NODE_ENVIRONMENT } from "../config";
import { NodeEnvironment } from "@lindorm-io/core";
import {
  appRoute,
  accountRoute,
  clientRoute,
  keyPairRoute,
  mfaRoute,
  oauthRoute,
  sessionRoute,
  userInfoRoute,
  wellKnownRoute,
} from "../route";
import { clientCacheWorker } from "@lindorm-io/koa-client";
import { keyPairCacheWorker, sessionCleanupWorker } from "../worker";
import { tokenIssuerMiddleware } from "@lindorm-io/koa-jwt";
import { winston } from "../logger";
import {
  cacheMiddleware,
  getMongoMiddleware,
  getRedisMiddleware,
  keystoreMiddleware,
  repositoryMiddleware,
} from "../middleware";

export const koa = new KoaApp({
  logger: winston,
  port: SERVER_PORT,
});

koa.addMiddleware(getMongoMiddleware());
koa.addMiddleware(repositoryMiddleware);
koa.addMiddleware(getRedisMiddleware());
koa.addMiddleware(cacheMiddleware);
koa.addMiddleware(keystoreMiddleware);
koa.addMiddleware(tokenIssuerMiddleware(TOKEN_ISSUER_MW_OPTIONS));

koa.addRoute("/", appRoute);
koa.addRoute("/account", accountRoute);
koa.addRoute("/client", clientRoute);
koa.addRoute("/key-pair", keyPairRoute);
koa.addRoute("/mfa", mfaRoute);
koa.addRoute("/oauth", oauthRoute);
koa.addRoute("/session", sessionRoute);
koa.addRoute("/userinfo", userInfoRoute);
koa.addRoute("/.well-known", wellKnownRoute);

if (NODE_ENVIRONMENT !== NodeEnvironment.TEST) {
  koa.addWorker(
    clientCacheWorker({
      ...CLIENT_CACHE_WORKER_OPTIONS,
      logger: winston,
    }),
  );
  koa.addWorker(keyPairCacheWorker);
  koa.addWorker(sessionCleanupWorker);
}
