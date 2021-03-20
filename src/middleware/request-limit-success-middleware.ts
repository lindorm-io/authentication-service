import { IKoaAuthContext } from "../typing";
import { TPromise } from "@lindorm-io/core";

export const requestLimitSuccessMiddleware = async (ctx: IKoaAuthContext, next: TPromise<void>): Promise<void> => {
  const { cache } = ctx;

  await next();

  if (ctx.requestLimit) {
    await cache.requestLimit.remove(ctx.requestLimit);
  }
};
