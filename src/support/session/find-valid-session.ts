import { IAuthContext } from "../../typing";
import { InvalidAuthorizationError, InvalidClientError, InvalidGrantTypeError, InvalidSubjectError } from "../../error";
import { Session } from "../../entity";
import { assertCodeChallenge } from "./challenge";
import { assertSessionIsNotExpired } from "./expires";

export interface IFindSessionOptions {
  codeVerifier: string;
  grantType: string;
  subject: string;
}

export const findValidSession = (ctx: IAuthContext) => async (options: IFindSessionOptions): Promise<Session> => {
  const { client, repository, token } = ctx;
  const { codeVerifier, grantType, subject } = options;
  const {
    authorization: { id: authorizationId, subject: sessionId },
  } = token;

  const session = await repository.session.find({ id: sessionId });

  try {
    if (session.authorization.id !== authorizationId) {
      throw new InvalidAuthorizationError(authorizationId);
    }

    assertSessionIsNotExpired(session);

    if (session.clientId !== client.id) {
      throw new InvalidClientError(client.id);
    }

    if (session.grantType !== grantType) {
      throw new InvalidGrantTypeError(grantType);
    }

    if (session.authorization.email !== subject) {
      throw new InvalidSubjectError(subject);
    }

    assertCodeChallenge(session, codeVerifier);
  } catch (err) {
    await repository.session.remove(session);
    throw err;
  }

  return session;
};
