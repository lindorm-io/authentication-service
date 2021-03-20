import { AccountRepository, KeyPairRepository, SessionRepository } from "../infrastructure";
import { ClientRepository } from "@lindorm-io/koa-client";
import { IKoaAuthContext } from "../typing";
import { TPromise } from "@lindorm-io/core";

export const repositoryMiddleware = async (ctx: IKoaAuthContext, next: TPromise<void>): Promise<void> => {
  const start = Date.now();

  const { logger, mongo } = ctx;
  const db = await mongo.getDatabase();

  ctx.repository = {
    account: new AccountRepository({ db, logger }),
    client: new ClientRepository({ db, logger }),
    keyPair: new KeyPairRepository({ db, logger }),
    session: new SessionRepository({ db, logger }),
  };

  logger.debug("repositories connected");

  ctx.metrics = {
    ...(ctx.metrics || {}),
    repository: Date.now() - start,
  };

  await next();
};
