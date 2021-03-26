import { Account, Session } from "../../entity";
import { Client } from "@lindorm-io/koa-client";
import { GrantType, ResponseType } from "../../enum";
import { Scope } from "@lindorm-io/jwt";
import { v4 as uuid } from "uuid";

export const getTestSession = (account: Account, client: Client, codeChallenge: string, codeMethod: string): Session =>
  new Session({
    accountId: account.id,
    authenticated: true,
    authorization: {
      codeChallenge: codeChallenge,
      codeMethod: codeMethod,
      email: account.email,
      id: uuid(),
      redirectUri: "https://redirect.uri/",
      responseType: ResponseType.REFRESH,
    },
    clientId: client.id,
    expires: new Date("2099-01-01"),
    grantType: GrantType.EMAIL_OTP,
    refreshId: uuid(),
    scope: [Scope.DEFAULT, Scope.EDIT, Scope.OPENID],
  });
