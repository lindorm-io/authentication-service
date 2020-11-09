import { APIError, HttpStatus } from "@lindorm-io/core";

export class InvalidAuthorizationError extends APIError {
  constructor(authorizationId: string) {
    super("Invalid Authorization ID", {
      debug: { id: authorizationId },
      statusCode: HttpStatus.ClientError.BAD_REQUEST,
    });
  }
}
