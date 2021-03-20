import { IKoaAuthContext } from "../../typing";
import { Scope, TokenIssuer } from "@lindorm-io/jwt";
import { assertBearerTokenScope } from "../../support";

export interface IGetOpenIdInformation {
  email: string;
  emailVerified: boolean;
  sub: string;
  updatedAt: number;
}

export const getOpenIdInformation = (ctx: IKoaAuthContext) => async (): Promise<IGetOpenIdInformation> => {
  const { account, logger } = ctx;

  logger.info("requesting openid account information", { id: account.id });

  assertBearerTokenScope(ctx)([Scope.DEFAULT, Scope.OPENID]);

  return {
    email: account.email,
    emailVerified: true,
    sub: account.id,
    updatedAt: TokenIssuer.dateToExpiry(account.updated),
  };
};
