import { includes } from "lodash";
import { APIError } from "@lindorm-io/errors";
import { HttpStatus } from "@lindorm-io/core";
import { ResponseType } from "../enum";

export const assertValidResponseTypeInput = (responseType: string): void => {
  const splitTypes = responseType.trim().split(" ");

  for (const type of splitTypes) {
    if (includes(ResponseType, type)) continue;

    throw new APIError("Invalid Response Type", {
      statusCode: HttpStatus.ClientError.BAD_REQUEST,
      details: `responseType [ ${type} ] is not supported.`,
      debug: {
        responseType,
        splitTypes,
      },
    });
  }
};

export const isResponseType = (responseType: string, expect: ResponseType): boolean => {
  const splitTypes = responseType.split(" ");

  for (const type of splitTypes) {
    if (type === expect) return true;
  }

  return false;
};
