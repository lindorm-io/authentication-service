import { APIError, HttpStatus } from "@lindorm-io/core";
import { Session } from "../entity";

export class ExpiredSessionError extends APIError {
  constructor(session: Session) {
    super("Session is expired", {
      debug: {
        id: session.id,
        expires: session.expires,
      },
      statusCode: HttpStatus.ClientError.UNAUTHORIZED,
    });
  }
}
