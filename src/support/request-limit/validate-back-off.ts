import { IAuthContext } from "../../typing";
import { isBefore } from "date-fns";
import { RequestLimitBackOffError } from "../../error";

export const validateRequestLimitBackOff = (ctx: IAuthContext) => (): void => {
  const { requestLimit } = ctx;

  if (!requestLimit?.backOffUntil) return;

  if (isBefore(new Date(), requestLimit.backOffUntil)) {
    throw new RequestLimitBackOffError(requestLimit);
  }
};
