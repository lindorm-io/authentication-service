import { assertAccountOTP, generateAccountOTP } from "./otp";
import { Account } from "../../entity";
import { baseParse } from "@lindorm-io/core";
import { authenticator } from "otplib";
import { MOCK_ACCOUNT_OPTIONS } from "../../test/mocks/repository";
import { CryptoAES } from "@lindorm-io/crypto";
import { OTP_HANDLER_OPTIONS } from "../../config";

describe("generateAccountOTP", () => {
  test("should resolve", () => {
    expect(generateAccountOTP()).toStrictEqual({
      signature: expect.any(String),
      uri: expect.stringContaining("otpauth://totp/test.lindorm.io"),
    });
  });
});

describe("assertAccountOTP", () => {
  test("should resolve", () => {
    const aes = new CryptoAES({
      secret: OTP_HANDLER_OPTIONS.secret,
    });
    const account = new Account({
      ...MOCK_ACCOUNT_OPTIONS,
      otp: generateAccountOTP(),
    });
    const code = authenticator.generate(aes.decrypt(baseParse(account.otp.signature)));
    expect(assertAccountOTP(account, code)).toBe(undefined);
  });
});
