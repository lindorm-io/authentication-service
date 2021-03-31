import { CryptoAES } from "@lindorm-io/crypto";
import { config } from "../../config";
import { assertAccountOTP, generateAccountOTP } from "./otp";
import { authenticator } from "otplib";
import { baseParse } from "@lindorm-io/core";
import { getTestAccountWithOTP } from "../../test";

describe("generateAccountOTP", () => {
  test("should resolve", () => {
    expect(generateAccountOTP()).toStrictEqual({
      signature: expect.any(String),
      uri: expect.stringContaining("otpauth://totp/test.authentication.lindorm.io"),
    });
  });
});

describe("assertAccountOTP", () => {
  test("should resolve", async () => {
    const aes = new CryptoAES({
      secret: config.CRYPTO_AES_SECRET,
    });
    const account = await getTestAccountWithOTP("email@lindorm.io", generateAccountOTP());
    const code = authenticator.generate(aes.decrypt(baseParse(account.otp.signature)));
    expect(assertAccountOTP(account, code)).toBe(undefined);
  });
});
