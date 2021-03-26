import { Account, Session } from "../../entity";
import { Client } from "@lindorm-io/koa-client";
import { IKoaAuthContext, ICreateTokensData } from "../../typing";
import { ResponseType } from "../../enum";
import { assertValidResponseTypeInput, isResponseType } from "../../util";
import { getAccessToken } from "./access";
import { getIdentityToken } from "./identity";
import { getRefreshToken } from "./refresh";
import { isScope, Scope } from "@lindorm-io/jwt";

export interface ICreateTokensOptions {
  account: Account;
  authMethodsReference: Array<string>;
  client: Client;
  responseType: string;
  session: Session;
}

export const createTokens = (ctx: IKoaAuthContext) => async (
  options: ICreateTokensOptions,
): Promise<ICreateTokensData> => {
  const { account, authMethodsReference, client, responseType, session } = options;
  const { scope } = session;

  assertValidResponseTypeInput(responseType);

  const result: ICreateTokensData = {};

  if (isResponseType(responseType, ResponseType.REFRESH)) {
    result.refreshToken = getRefreshToken(ctx)({
      account,
      authMethodsReference,
      client,
      scope,
      session,
    });
  }

  if (isResponseType(responseType, ResponseType.ACCESS)) {
    result.accessToken = getAccessToken(ctx)({
      account,
      authMethodsReference,
      client,
      scope,
    });
  }

  if (isResponseType(responseType, ResponseType.IDENTITY) && isScope(scope, Scope.OPENID)) {
    result.identityToken = await getIdentityToken(ctx)({
      account,
      client,
      scope,
    });
  }

  return result;
};
