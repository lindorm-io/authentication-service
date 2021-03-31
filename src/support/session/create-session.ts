import { Account, Authorization, Session } from "../../entity";
import { IKoaAuthContext } from "../../typing";
import { config } from "../../config";
import { getExpiryDate } from "../../util";
import { v4 as uuid } from "uuid";

export interface ICreateSessionOptions {
  account: Account;
  authorization: Authorization;
}

export const createSession = (ctx: IKoaAuthContext) => async (options: ICreateSessionOptions): Promise<Session> => {
  const { cache, client, repository } = ctx;
  const { account, authorization } = options;

  const expiry = client.extra?.jwtRefreshTokenExpiry || config.JWT_REFRESH_TOKEN_EXPIRY;

  const session = await repository.session.create(
    new Session({
      accountId: account.id,
      clientId: authorization.clientId,
      deviceId: authorization.deviceId,
      expires: getExpiryDate(expiry),
      grantType: authorization.grantType,
      refreshId: uuid(),
      scope: authorization.scope,
    }),
  );

  try {
    await cache.authorization.remove(authorization);
  } catch (_) {
    /* ignored */
  }

  return session;
};
