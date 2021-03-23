import { APIError } from "@lindorm-io/errors";
import { HttpStatus } from "@lindorm-io/core";
import { RequestLimit } from "../entity";

export class RequestLimitBackOffError extends APIError {
  constructor(requestLimit: RequestLimit) {
    super("This request has been rate-limited", {
      publicData: {
        failedTries: requestLimit.failedTries,
        backOffUntil: requestLimit.backOffUntil,
      },
      statusCode: HttpStatus.ClientError.FORBIDDEN,
    });
  }
}
