import { APIError } from "@lindorm-io/errors";
import { HttpStatus } from "@lindorm-io/core";
import { Authorization } from "../entity";

export class ExpiredAuthorizationError extends APIError {
  constructor(authorization: Authorization) {
    super("Authorization is expired", {
      debug: {
        id: authorization.id,
        expires: authorization.expires,
      },
      statusCode: HttpStatus.ClientError.UNAUTHORIZED,
    });
  }
}
