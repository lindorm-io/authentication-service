import { IAuthContext } from "../../typing";
import { Scope, TokenIssuer, isScope } from "@lindorm-io/jwt";
import { InvalidScopeError } from "../../error";

export interface IGetOpenIdInformation {
  email: string;
  emailVerified: boolean;
  sub: string;
  updatedAt: number;
}

export const getOpenIdInformation = (ctx: IAuthContext) => async (): Promise<IGetOpenIdInformation> => {
  const { account, logger, token } = ctx;
  const {
    bearer: { scope },
  } = token;

  logger.info("requesting openid account information", { id: account.id });

  if (!isScope(scope, Scope.DEFAULT)) {
    throw new InvalidScopeError(scope, Scope.DEFAULT);
  }

  if (!isScope(scope, Scope.OPENID)) {
    throw new InvalidScopeError(scope, Scope.OPENID);
  }

  return {
    email: account.email,
    emailVerified: true,
    sub: account.id,
    updatedAt: TokenIssuer.dateToExpiry(account.updated),
  };
};
