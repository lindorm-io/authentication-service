import { APIError } from "@lindorm-io/errors";
import { HttpStatus } from "@lindorm-io/core";
import { Scope } from "@lindorm-io/jwt";

export class InvalidScopeInputError extends APIError {
  constructor(scope: string) {
    super("Invalid Scope Input", {
      debug: { scope },
      details: "Scope input does not match the expected array of values",
      publicData: { scope, expected: Object.values(Scope) },
      statusCode: HttpStatus.ClientError.BAD_REQUEST,
    });
  }
}
