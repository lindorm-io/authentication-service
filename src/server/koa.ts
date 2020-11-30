import { CLIENT_CACHE_WORKER_OPTIONS, SERVER_PORT, TOKEN_ISSUER_MW_OPTIONS } from "../config";
import { KoaApp } from "@lindorm-io/koa";
import { NODE_ENVIRONMENT } from "../config";
import { NodeEnvironment } from "@lindorm-io/core";
import { appRoot, account, client, device, keyPair, mfa, oauth, session, userInfo, wellKnown } from "../route";
import { clientCacheWorker, clientMiddleware } from "@lindorm-io/koa-client";
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
koa.addMiddleware(clientMiddleware);
koa.addMiddleware(keystoreMiddleware);
koa.addMiddleware(tokenIssuerMiddleware(TOKEN_ISSUER_MW_OPTIONS));

koa.addRoute("/", appRoot);
koa.addRoute("/account", account);
koa.addRoute("/client", client);
koa.addRoute("/device", device);
koa.addRoute("/key-pair", keyPair);
koa.addRoute("/mfa", mfa);
koa.addRoute("/oauth", oauth);
koa.addRoute("/session", session);
koa.addRoute("/userinfo", userInfo);
koa.addRoute("/.well-known", wellKnown);

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
