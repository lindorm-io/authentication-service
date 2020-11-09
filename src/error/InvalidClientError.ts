import { APIError, HttpStatus } from "@lindorm-io/core";

export class InvalidClientError extends APIError {
  constructor(clientId: string, error?: Error) {
    super("Invalid Client ID", {
      debug: { id: clientId, error },
      statusCode: HttpStatus.ClientError.BAD_REQUEST,
    });
  }
}
