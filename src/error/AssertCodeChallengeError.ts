import { APIError, HttpStatus } from "@lindorm-io/core";

export class AssertCodeChallengeError extends APIError {
  constructor(challenge: string, verifier: string) {
    super("Invalid Code Challenge", {
      debug: { challenge, verifier },
      statusCode: HttpStatus.ClientError.FORBIDDEN,
    });
  }
}
