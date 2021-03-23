import { APIError } from "@lindorm-io/errors";
import { HttpStatus } from "@lindorm-io/core";

export class InvalidAuthorizationTokenError extends APIError {
  constructor() {
    super("Invalid Authorization Token", {
      statusCode: HttpStatus.ClientError.FORBIDDEN,
    });
  }
}
