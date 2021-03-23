import { GrantType } from "../../enum";
import { RequestLimit } from "../../entity";
import { add } from "date-fns";
import { stringToDurationObject } from "@lindorm-io/core";

const maxFailed: Record<string, number> = {
  [GrantType.DEVICE_PIN]: 3,
  [GrantType.DEVICE_SECRET]: 3,
  [GrantType.EMAIL_LINK]: 3,
  [GrantType.EMAIL_OTP]: 3,
  [GrantType.MULTI_FACTOR_OOB]: 3,
  [GrantType.MULTI_FACTOR_OTP]: 3,
  [GrantType.PASSWORD]: 3,
  [GrantType.REFRESH_TOKEN]: 3,
};

const getBackOffDuration = (entity: RequestLimit): string => {
  const { failedTries, grantType } = entity;

  if (failedTries === maxFailed[grantType]) return "1 minutes";
  if (failedTries === maxFailed[grantType] + 1) return "3 minutes";
  if (failedTries === maxFailed[grantType] + 2) return "5 minutes";
  if (failedTries === maxFailed[grantType] + 3) return "15 minutes";
  if (failedTries === maxFailed[grantType] + 4) return "30 minutes";
  if (failedTries === maxFailed[grantType] + 5) return "1 hours";
  if (failedTries >= maxFailed[grantType] + 6) return "2 hours";
};

export const getBackOffDate = (entity: RequestLimit): Date => {
  const { failedTries, grantType } = entity;

  if (failedTries < maxFailed[grantType]) return null;

  return add(new Date(), stringToDurationObject(getBackOffDuration(entity)));
};
