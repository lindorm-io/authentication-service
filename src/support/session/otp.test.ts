import { assertSessionOTP, encryptSessionOTP } from "./otp";
import { Session } from "../../entity";
import { MOCK_SESSION_OPTIONS } from "../../test/mocks/repository";

describe("encryptSessionOTP", () => {
  test("should resolve", () => {
    expect(encryptSessionOTP("secret")).not.toBe("secret");
  });
});

describe("assertSessionOTP", () => {
  test("should resolve", () => {
    const session = new Session({
      ...MOCK_SESSION_OPTIONS,
      authorization: {
        ...MOCK_SESSION_OPTIONS.authorization,
        otpCode: encryptSessionOTP("code"),
      },
    });
    expect(assertSessionOTP(session, "code")).toBe(undefined);
  });
});
