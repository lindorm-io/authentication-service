import { APIError, HttpStatus } from "@lindorm-io/core";

export class AssertClientSecretError extends APIError {
  constructor(clientId: string, error?: Error) {
    super("Invalid Client Secret", {
      debug: { id: clientId, error },
      statusCode: HttpStatus.ClientError.FORBIDDEN,
    });
  }
}
