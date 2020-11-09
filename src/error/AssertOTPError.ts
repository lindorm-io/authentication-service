import { APIError, HttpStatus } from "@lindorm-io/core";

export class AssertOTPError extends APIError {
  constructor() {
    super("Invalid OTP", {
      statusCode: HttpStatus.ClientError.FORBIDDEN,
    });
  }
}
