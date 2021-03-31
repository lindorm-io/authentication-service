import { KoaApp } from "@lindorm-io/koa";
import { config, IS_TEST } from "../config";
import { clientCacheMiddleware, clientRepositoryMiddleware } from "@lindorm-io/koa-client";
import { clientCacheWorker, keyPairCacheWorker, sessionCleanupWorker } from "../worker";
import { keyPairRepositoryMiddleware } from "@lindorm-io/koa-keystore";
import { winston } from "../logger";
import {
  cacheMiddleware,
  deviceAxiosMiddleware,
  identityAxiosMiddleware,
  keyPairCacheMiddleware,
  keystoreMiddleware,
  mongoMiddleware,
  redisMiddleware,
  repositoryMiddleware,
  tokenIssuerMiddleware,
} from "../middleware";
import {
  accountRoute,
  clientRoute,
  keyPairRoute,
  mfaRoute,
  oauthRoute,
  sessionRoute,
  userInfoRoute,
  wellKnownRoute,
} from "../route";

export const koa = new KoaApp({
  logger: winston,
  port: config.SERVER_PORT,
});

// mongo
koa.addMiddleware(mongoMiddleware);
koa.addMiddleware(clientRepositoryMiddleware);
koa.addMiddleware(keyPairRepositoryMiddleware);
koa.addMiddleware(repositoryMiddleware);

// redis
koa.addMiddleware(redisMiddleware);
koa.addMiddleware(clientCacheMiddleware);
koa.addMiddleware(keyPairCacheMiddleware);
koa.addMiddleware(cacheMiddleware);

// auth tokens
koa.addMiddleware(keystoreMiddleware);
koa.addMiddleware(tokenIssuerMiddleware);

// axios
koa.addMiddleware(deviceAxiosMiddleware);
koa.addMiddleware(identityAxiosMiddleware);

// routes
koa.addRoute("/account", accountRoute);
koa.addRoute("/client", clientRoute);
koa.addRoute("/key-pair", keyPairRoute);
koa.addRoute("/mfa", mfaRoute);
koa.addRoute("/oauth", oauthRoute);
koa.addRoute("/session", sessionRoute);
koa.addRoute("/userinfo", userInfoRoute);
koa.addRoute("/.well-known", wellKnownRoute);

// workers
if (!IS_TEST) {
  koa.addWorker(clientCacheWorker);
  koa.addWorker(keyPairCacheWorker);
  koa.addWorker(sessionCleanupWorker);
}
