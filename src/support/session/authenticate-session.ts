import { Account, Session } from "../../entity";
import { IKoaAuthContext } from "../../typing";
import { JWT_REFRESH_TOKEN_EXPIRY } from "../../config";
import { getSessionExpires } from "./expires";
import { v4 as uuid } from "uuid";
import { InvalidAuthorizationTokenError } from "../../error";

export interface IAuthenticateSessionOptions {
  account: Account;
  session: Session;
}

export const authenticateSession = (ctx: IKoaAuthContext) => async (
  options: IAuthenticateSessionOptions,
): Promise<Session> => {
  const { client, repository } = ctx;
  const { account, session } = options;

  if (session.authenticated) {
    throw new InvalidAuthorizationTokenError();
  }

  const expires = client.extra?.jwtRefreshTokenExpiry || JWT_REFRESH_TOKEN_EXPIRY;

  session.accountId = account.id;
  session.authenticated = true;
  session.expires = getSessionExpires(expires);
  session.refreshId = uuid();

  return repository.session.update(session);
};
