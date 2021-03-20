import { IKoaAuthContext } from "../../typing";
import { InvalidAuthorizationError, InvalidDeviceError, InvalidGrantTypeError, InvalidSubjectError } from "../../error";
import { InvalidClientError } from "@lindorm-io/koa-client";
import { Session } from "../../entity";
import { assertCodeChallenge } from "./challenge";
import { assertSessionIsNotExpired } from "./expires";

export interface IFindSessionOptions {
  codeVerifier: string;
  grantType: string;
  subject: string;
}

export const findValidSession = (ctx: IKoaAuthContext) => async (options: IFindSessionOptions): Promise<Session> => {
  const { client, metadata, repository, token } = ctx;
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

    if (session.deviceId !== metadata.deviceId) {
      throw new InvalidDeviceError(metadata.deviceId);
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
