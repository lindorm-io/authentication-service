import { GrantType } from "../../enum";
import { IAuthContext } from "../../typing";
import { RequestLimit } from "../../entity";
import { getBackOffDate } from "./back-off";

export interface ICreateOrUpdateOptions {
  grantType: GrantType;
  subject: string;
}

export const createOrUpdateRequestLimit = (ctx: IAuthContext) => async (
  options: ICreateOrUpdateOptions,
): Promise<void> => {
  const { cache } = ctx;
  const { grantType, subject } = options;

  if (!ctx.requestLimit) {
    ctx.requestLimit = await cache.requestLimit.create(
      new RequestLimit({
        subject,
        grantType,
      }),
    );

    return;
  }

  ctx.requestLimit.failedTries += 1;
  ctx.requestLimit.backOffUntil = getBackOffDate(ctx.requestLimit);
};
