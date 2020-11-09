import { Account, Session } from "../../entity";
import { IAuthContext } from "../../typing";
import { JWT_REFRESH_TOKEN_EXPIRY } from "../../config";
import { getSessionExpires } from "./expires";
import { v4 as uuid } from "uuid";
import { InvalidAuthorizationTokenError } from "../../error";

export interface IAuthenticateSessionOptions {
  account: Account;
  session: Session;
}

export const authenticateSession = (ctx: IAuthContext) => async (
  options: IAuthenticateSessionOptions,
): Promise<Session> => {
  const { repository } = ctx;
  const { account, session } = options;

  if (session.authenticated) {
    throw new InvalidAuthorizationTokenError();
  }

  session.accountId = account.id;
  session.authenticated = true;
  session.expires = getSessionExpires(JWT_REFRESH_TOKEN_EXPIRY);
  session.refreshId = uuid();

  return repository.session.update(session);
};
