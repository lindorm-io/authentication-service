import { Account, Client, Device, Session } from "../../entity";
import { IAuthContext, ICreateTokensData } from "../../typing";
import { ResponseType, Scope } from "../../enum";
import { TObject } from "@lindorm-io/core";
import { assertResponseType, isResponseType } from "../../util";
import { getAccessToken } from "./access";
import { getIdentityToken } from "./identity";
import { getRefreshToken } from "./refresh";
import { includes } from "lodash";

export interface ICreateTokensOptions {
  account: Account;
  authMethodsReference: string;
  client: Client;
  device?: Device;
  payload?: TObject<any>;
  responseType: string;
  session: Session;
}

export const createTokens = (ctx: IAuthContext) => (options: ICreateTokensOptions): ICreateTokensData => {
  const { account, authMethodsReference, client, device, payload, responseType, session } = options;
  const { scope } = session;

  const scopes = scope ? scope?.split(" ") : [];

  assertResponseType(responseType);

  const result: ICreateTokensData = {};

  if (isResponseType(responseType, ResponseType.REFRESH)) {
    result.refreshToken = getRefreshToken(ctx)({
      account,
      authMethodsReference,
      client,
      device,
      scope,
      session,
    });
  }

  if (isResponseType(responseType, ResponseType.ACCESS)) {
    result.accessToken = getAccessToken(ctx)({
      account,
      authMethodsReference,
      client,
      device,
      scope,
    });
  }

  if (isResponseType(responseType, ResponseType.IDENTITY) && includes(scopes, Scope.OPENID)) {
    result.identityToken = getIdentityToken(ctx)({
      account,
      client,
      device,
      payload,
    });
  }

  return result;
};
