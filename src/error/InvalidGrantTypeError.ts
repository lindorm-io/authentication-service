import { APIError, HttpStatus } from "@lindorm-io/core";

export class InvalidGrantTypeError extends APIError {
  constructor(grantType: string) {
    super("Invalid Grant Type", {
      debug: { grantType },
      statusCode: HttpStatus.ClientError.BAD_REQUEST,
    });
  }
}
