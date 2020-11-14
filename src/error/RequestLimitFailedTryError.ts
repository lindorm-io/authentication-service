import { APIError, ExtendableError, HttpStatus } from "@lindorm-io/core";
import { RequestLimit } from "../entity";

export class RequestLimitFailedTryError extends APIError {
  constructor(requestLimit: RequestLimit, error: ExtendableError) {
    super("This request failed and has been rate-limited", {
      publicData: {
        failedTries: requestLimit.failedTries,
        backOffUntil: requestLimit.backOffUntil,
      },
      details: error?.details || error?.message,
      debug: { error },
      statusCode: HttpStatus.ClientError.FORBIDDEN,
    });
  }
}
