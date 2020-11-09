import { APIError, HttpStatus } from "@lindorm-io/core";

export class InvalidAuthorizationTokenError extends APIError {
  constructor() {
    super("Invalid Authorization Token", {
      statusCode: HttpStatus.ClientError.FORBIDDEN,
    });
  }
}
