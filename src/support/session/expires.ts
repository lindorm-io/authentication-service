import { isAfter } from "date-fns";
import { Session } from "../../entity";
import { ExpiredSessionError } from "../../error";

export const assertSessionIsNotExpired = (session: Session): void => {
  if (isAfter(new Date(), new Date(session.expires))) {
    throw new ExpiredSessionError(session);
  }
};
