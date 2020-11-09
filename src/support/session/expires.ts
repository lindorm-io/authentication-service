import { add, isAfter } from "date-fns";
import { stringToDurationObject } from "@lindorm-io/core";
import { Session } from "../../entity";
import { ExpiredSessionError } from "../../error";

export const getSessionExpires = (expiry: string): Date => {
  return add(Date.now(), stringToDurationObject(expiry));
};

export const assertSessionIsNotExpired = (session: Session): void => {
  if (isAfter(new Date(), new Date(session.expires))) {
    throw new ExpiredSessionError(session);
  }
};
