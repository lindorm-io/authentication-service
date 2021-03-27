import { isAfter } from "date-fns";
import { Authorization } from "../../entity";
import { ExpiredAuthorizationError } from "../../error";

export const assertAuthorizationIsNotExpired = (authorization: Authorization): void => {
  if (isAfter(new Date(), new Date(authorization.expires))) {
    throw new ExpiredAuthorizationError(authorization);
  }
};
