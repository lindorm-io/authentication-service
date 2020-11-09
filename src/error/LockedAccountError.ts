import { APIError, HttpStatus } from "@lindorm-io/core";

export class LockedAccountError extends APIError {
  constructor(accountId: string) {
    super("Account is locked", {
      debug: { accountId },
      statusCode: HttpStatus.ClientError.FORBIDDEN,
    });
  }
}
