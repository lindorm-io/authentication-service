import { assertSessionOTP, encryptSessionOTP } from "./otp";
import { Session } from "../../entity";
import { v4 as uuid } from "uuid";
import { GrantType, ResponseType } from "../../enum";
import { Scope } from "@lindorm-io/jwt";

describe("encryptSessionOTP", () => {
  test("should resolve", () => {
    expect(encryptSessionOTP("secret")).not.toBe("secret");
  });
});

describe("assertSessionOTP", () => {
  test("should resolve", () => {
    const session = new Session({
      accountId: "3beef5c1-5bca-42d3-8591-87db47c1fb6c",
      authenticated: true,
      authorization: {
        codeChallenge: "H4LnTn7e1DltMsohJgIeKSNgpvppJ1qP6QRRD9Ai1pw=",
        codeMethod: "sha256",
        email: "email@lindorm.io",
        id: uuid(),
        redirectUri: "https://redirect.uri/",
        responseType: ResponseType.REFRESH,
        otpCode: encryptSessionOTP("code"),
      },
      clientId: "5bb31096-d082-41ac-bce5-b01c326026ce",
      deviceId: "11388709-2ced-4c53-8f17-7cf867c01432",
      expires: new Date("2099-01-01"),
      grantType: GrantType.EMAIL_OTP,
      refreshId: uuid(),
      scope: [Scope.DEFAULT, Scope.EDIT, Scope.OPENID].join(" "),
    });

    expect(assertSessionOTP(session, "code")).toBe(undefined);
  });
});
