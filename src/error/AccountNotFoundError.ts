import { APIError, HttpStatus } from "@lindorm-io/core";

export class AccountNotFoundError extends APIError {
  constructor(accountId?: string) {
    super("Account not found", {
      debug: { accountId },
      statusCode: HttpStatus.ClientError.BAD_REQUEST,
    });
  }
}
