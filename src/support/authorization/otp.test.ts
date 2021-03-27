import { assertAuthorizationOTP, encryptAuthorizationOTP } from "./otp";
import { getTestAuthorization } from "../../test";

describe("encryptSessionOTP", () => {
  test("should resolve", () => {
    expect(encryptAuthorizationOTP("secret")).not.toBe("secret");
  });
});

describe("assertSessionOTP", () => {
  test("should resolve", () => {
    const authorization = getTestAuthorization({
      otpCode: encryptAuthorizationOTP("code"),
    });

    expect(assertAuthorizationOTP(authorization, "code")).toBe(undefined);
  });
});
