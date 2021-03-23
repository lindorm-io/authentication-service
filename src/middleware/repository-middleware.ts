import { AccountRepository, SessionRepository } from "../infrastructure";
import { IKoaAuthContext, TNext } from "../typing";

export const repositoryMiddleware = async (ctx: IKoaAuthContext, next: TNext): Promise<void> => {
  const start = Date.now();

  const { logger, mongo } = ctx;
  const db = await mongo.getDatabase();

  ctx.repository = {
    ...ctx.repository,
    account: new AccountRepository({ db, logger }),
    session: new SessionRepository({ db, logger }),
  };

  logger.debug("repositories connected");

  ctx.metrics = {
    ...(ctx.metrics || {}),
    repository: Date.now() - start,
  };

  await next();
};
