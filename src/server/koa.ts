import { KoaApp } from "@lindorm-io/koa";
import { MONGO_MW_OPTIONS, REDIS_MW_OPTIONS, SERVER_PORT, TOKEN_ISSUER_MW_OPTIONS } from "../config";
import { appRoot, account, client, device, keyPair, mfa, oauth, session, userInfo, wellKnown } from "../route";
import { sessionCleanupWorker } from "../worker/session-cleanup";
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

koa.addMiddleware(getMongoMiddleware(MONGO_MW_OPTIONS));
koa.addMiddleware(repositoryMiddleware);
koa.addMiddleware(getRedisMiddleware(REDIS_MW_OPTIONS));
koa.addMiddleware(cacheMiddleware);
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

koa.addWorker(sessionCleanupWorker);
