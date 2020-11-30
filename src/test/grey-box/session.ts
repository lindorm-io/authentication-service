import { Account, Session } from "../../entity";
import { GrantType, ResponseType } from "../../enum";
import { Scope } from "@lindorm-io/jwt";
import { TEST_CLIENT } from "./setup-integration";
import { v4 as uuid } from "uuid";

export const getGreyBoxSession = (account: Account, codeChallenge: string, codeMethod: string): Session =>
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
    clientId: TEST_CLIENT.id,
    expires: new Date("2099-01-01"),
    grantType: GrantType.EMAIL_OTP,
    refreshId: uuid(),
    scope: [Scope.DEFAULT, Scope.EDIT, Scope.OPENID].join(" "),
  });
