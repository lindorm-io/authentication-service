import { IKoaAuthContext } from "../../typing";
import { isBefore } from "date-fns";
import { RequestLimitBackOffError } from "../../error";

export const validateRequestLimitBackOff = (ctx: IKoaAuthContext) => (): void => {
  const { requestLimit } = ctx;

  if (!requestLimit?.backOffUntil) return;

  if (isBefore(new Date(), requestLimit.backOffUntil)) {
    throw new RequestLimitBackOffError(requestLimit);
  }
};
