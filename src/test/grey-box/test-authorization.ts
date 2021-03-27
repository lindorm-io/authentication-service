import { Authorization } from "../../entity";
import { Client } from "@lindorm-io/koa-client";
import { GrantType, ResponseType } from "../../enum";
import { Scope } from "@lindorm-io/jwt";
import { getTestClient } from "./test-client";

export const getTestAuthorization = ({
  client = getTestClient(),
  codeChallenge = "H4LnTn7e1DltMsohJgIeKSNgpvppJ1qP6QRRD9Ai1pw=",
  codeMethod = "sha256",
  email = "email@lindorm.io",
  expires = new Date("2099-01-01"),
  otpCode = null,
}: {
  client?: Client;
  codeChallenge?: string;
  codeMethod?: string;
  email?: string;
  expires?: Date;
  otpCode?: string;
}): Authorization =>
  new Authorization({
    challengeId: "1997d969-0e46-41c5-8c5e-836d643e78c9",
    clientId: client.id,
    codeChallenge,
    codeMethod,
    email,
    expires,
    grantType: GrantType.EMAIL_OTP,
    id: "4923fabc-aab2-4804-b92b-2aa96c4999a1",
    otpCode,
    redirectUri: "https://redirect.uri/",
    responseType: ResponseType.REFRESH,
    scope: [Scope.DEFAULT, Scope.EDIT, Scope.OPENID],
  });
