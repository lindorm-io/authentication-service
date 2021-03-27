import { Session } from "../../entity";
import { GrantType } from "../../enum";
import { Scope } from "@lindorm-io/jwt";
import { getTestAccount } from "./test-account";
import { getTestClient } from "./test-client";

export const getTestSession = ({
  account = getTestAccount("email@lindorm.io"),
  client = getTestClient(),
  deviceId = "22c42ad2-7f93-4173-9204-8ad100eb2b57",
  expires = new Date("2099-01-01"),
  grantType = GrantType.EMAIL_OTP,
  refreshId = "46757f59-e48c-4726-83f8-320208bf5c49",
  scope = [Scope.DEFAULT, Scope.EDIT, Scope.OPENID],
}): Session =>
  new Session({
    accountId: account.id,
    clientId: client.id,
    deviceId,
    expires,
    grantType,
    refreshId,
    scope,
  });
