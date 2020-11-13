import { IAuthContext } from "../../typing";
import { isBefore } from "date-fns";

export const validateRequestLimitBackOff = (ctx: IAuthContext) => (): void => {
  const { requestLimit } = ctx;

  if (!requestLimit?.backOffUntil) return;

  if (isBefore(new Date(), ctx.requestLimit.backOffUntil)) {
    throw new Error("Rate Limited");
  }
};
