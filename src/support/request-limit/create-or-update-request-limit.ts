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
  const { cache, requestLimit } = ctx;
  const { grantType, subject } = options;

  if (!requestLimit) {
    await cache.requestLimit.create(
      new RequestLimit({
        subject,
        grantType,
      }),
    );

    return;
  }

  ctx.requestLimit.failedTries = requestLimit.failedTries + 1;
  ctx.requestLimit.backOffUntil = getBackOffDate(requestLimit);
};
