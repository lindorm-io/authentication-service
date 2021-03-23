import { IKoaAuthContext, TNext } from "../typing";

export const requestLimitSuccessMiddleware = async (ctx: IKoaAuthContext, next: TNext): Promise<void> => {
  const { cache } = ctx;

  await next();

  if (ctx.requestLimit) {
    await cache.requestLimit.remove(ctx.requestLimit);
  }
};
