import { IKoaAuthContext } from "../typing";
import { TPromise } from "@lindorm-io/core";
import { Keystore } from "@lindorm-io/key-pair";

export const keystoreMiddleware = async (ctx: IKoaAuthContext, next: TPromise<void>): Promise<void> => {
  const start = Date.now();

  const { logger, repository } = ctx;

  const keys = await repository.keyPair.findMany({});

  ctx.keystore = new Keystore({ keys });

  logger.debug("keystore initialised", { amount: keys.length });

  ctx.metrics = {
    ...(ctx.metrics || {}),
    keystore: Date.now() - start,
  };

  await next();
};
