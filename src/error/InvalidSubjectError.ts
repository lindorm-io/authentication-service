import { APIError, HttpStatus } from "@lindorm-io/core";

export class InvalidSubjectError extends APIError {
  constructor(subject: string) {
    super("Invalid Subject", {
      debug: { subject },
      statusCode: HttpStatus.ClientError.BAD_REQUEST,
    });
  }
}
