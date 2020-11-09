import { IAuthContext } from "../../typing";
import { InvalidClientError, InvalidDeviceError, InvalidRefreshTokenError } from "../../error";
import { JWT_REFRESH_TOKEN_EXPIRY } from "../../config";
import { Session } from "../../entity";
import { assertSessionIsNotExpired, getSessionExpires } from "./expires";
import { v4 as uuid } from "uuid";

export const extendSession = (ctx: IAuthContext) => async (): Promise<Session> => {
  const { client, device, repository, token } = ctx;
  const {
    refresh: { id: refreshId, subject: sessionId },
  } = token;

  const session = await repository.session.find({ id: sessionId });

  if (session.refreshId !== refreshId) {
    throw new InvalidRefreshTokenError(refreshId);
  }

  assertSessionIsNotExpired(session);

  if (session.clientId !== client.id) {
    throw new InvalidClientError(client.id);
  }

  if (session.deviceId && session.deviceId !== device?.id) {
    throw new InvalidDeviceError(device?.id);
  }

  session.expires = getSessionExpires(JWT_REFRESH_TOKEN_EXPIRY);
  session.refreshId = uuid();

  return repository.session.update(session);
};
