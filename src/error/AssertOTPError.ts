import { APIError } from "@lindorm-io/errors";
import { HttpStatus } from "@lindorm-io/core";

export class AssertOTPError extends APIError {
  constructor() {
    super("Invalid OTP", {
      statusCode: HttpStatus.ClientError.FORBIDDEN,
    });
  }
}
