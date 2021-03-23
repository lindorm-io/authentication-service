import { APIError } from "@lindorm-io/errors";
import { HttpStatus } from "@lindorm-io/core";

export class InvalidExpiryString extends APIError {
  constructor(expires: string) {
    super(`Invalid expiry string: [ ${expires} ]`, {
      debug: {
        expires,
      },
      statusCode: HttpStatus.ClientError.BAD_REQUEST,
    });
  }
}
