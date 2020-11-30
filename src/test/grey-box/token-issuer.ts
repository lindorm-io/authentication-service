import { Account, Session } from "../../entity";
import { Audience } from "../../enum";
import { JWT_ACCESS_TOKEN_EXPIRY } from "../../config";
import { Scope } from "@lindorm-io/jwt";
import { TEST_CLIENT, TEST_TOKEN_ISSUER } from "./setup-integration";

export const getGreyBoxAccessToken = (account: Account): string => {
  const { token } = TEST_TOKEN_ISSUER.sign({
    audience: Audience.ACCESS,
    clientId: TEST_CLIENT.id,
    expiry: JWT_ACCESS_TOKEN_EXPIRY,
    permission: account.permission,
    scope: [Scope.DEFAULT, Scope.EDIT, Scope.OPENID].join(" "),
    subject: account.id,
  });
  return token;
};

export const getGreyBoxRefreshToken = (account: Account, session: Session): string => {
  const { token } = TEST_TOKEN_ISSUER.sign({
    audience: Audience.REFRESH,
    authMethodsReference: "email",
    clientId: TEST_CLIENT.id,
    expiry: session.expires,
    id: session.refreshId,
    permission: account.permission,
    scope: [Scope.DEFAULT, Scope.EDIT, Scope.OPENID].join(" "),
    subject: session.id,
  });
  return token;
};
