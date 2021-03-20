import { IKoaAuthContext } from "../../typing";
import { InvalidClientError } from "@lindorm-io/koa-client";
import { InvalidDeviceError, InvalidRefreshTokenError } from "../../error";
import { JWT_REFRESH_TOKEN_EXPIRY } from "../../config";
import { Session } from "../../entity";
import { assertSessionIsNotExpired, getSessionExpires } from "./expires";
import { v4 as uuid } from "uuid";

export const extendSession = (ctx: IKoaAuthContext) => async (): Promise<Session> => {
  const { client, metadata, repository, token } = ctx;
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

  if (session.deviceId && session.deviceId !== metadata.deviceId) {
    throw new InvalidDeviceError(metadata.deviceId);
  }

  const expires = client.extra?.jwtRefreshTokenExpiry || JWT_REFRESH_TOKEN_EXPIRY;

  session.expires = getSessionExpires(expires);
  session.refreshId = uuid();

  return repository.session.update(session);
};
