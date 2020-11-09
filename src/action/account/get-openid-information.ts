import { IAuthContext } from "../../typing";
import { Scope } from "../../enum";
import { TokenIssuer } from "@lindorm-io/jwt";
import { includes } from "lodash";

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

  const scopes = scope.split(" ");

  if (!includes(scopes, Scope.DEFAULT)) {
    throw new Error("invalid scope");
  }

  if (!includes(scopes, Scope.OPENID)) {
    throw new Error("invalid scope");
  }

  return {
    email: account.email,
    emailVerified: true,
    sub: account.id,
    updatedAt: TokenIssuer.dateToExpiry(account.updated),
  };
};
