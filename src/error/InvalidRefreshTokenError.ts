import { APIError, HttpStatus } from "@lindorm-io/core";

export class InvalidRefreshTokenError extends APIError {
  constructor(refreshId: string) {
    super("Invalid Refresh Token", {
      debug: { refreshId },
      statusCode: HttpStatus.ClientError.BAD_REQUEST,
    });
  }
}
