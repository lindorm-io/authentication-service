import { APIError, HttpStatus } from "@lindorm-io/core";

export class RejectedClientError extends APIError {
  constructor(clientId: string, error?: Error) {
    super("Client is not approved", {
      debug: { id: clientId, error },
      statusCode: HttpStatus.ClientError.BAD_REQUEST,
    });
  }
}
