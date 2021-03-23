import { KoaApp } from "@lindorm-io/koa";
import { NODE_ENVIRONMENT } from "../config";
import { NodeEnvironment } from "@lindorm-io/koa-config";
import { SERVER_PORT } from "../config";
import {
  cacheMiddleware,
  getMongoMiddleware,
  getRedisMiddleware,
  repositoryMiddleware,
  tokenIssuerMiddleware,
} from "../middleware";
import { clientCacheMiddleware, clientRepositoryMiddleware } from "@lindorm-io/koa-client";
import { clientCacheWorker, keyPairCacheWorker, sessionCleanupWorker } from "../worker";
import { winston } from "../logger";
import {
  cachedKeystoreMiddleware,
  keyPairCacheMiddleware,
  keyPairRepositoryMiddleware,
} from "@lindorm-io/koa-keystore";
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

export const koa = new KoaApp({
  logger: winston,
  port: SERVER_PORT,
});

koa.addMiddleware(getMongoMiddleware());
koa.addMiddleware(repositoryMiddleware);
koa.addMiddleware(clientRepositoryMiddleware);
koa.addMiddleware(keyPairRepositoryMiddleware);

koa.addMiddleware(getRedisMiddleware());
koa.addMiddleware(cacheMiddleware);
koa.addMiddleware(clientCacheMiddleware);
koa.addMiddleware(keyPairCacheMiddleware);

koa.addMiddleware(cachedKeystoreMiddleware);
koa.addMiddleware(tokenIssuerMiddleware);

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
  koa.addWorker(clientCacheWorker);
  koa.addWorker(keyPairCacheWorker);
  koa.addWorker(sessionCleanupWorker);
}
