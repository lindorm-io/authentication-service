import MockDate from "mockdate";
import { CryptoAES } from "@lindorm-io/crypto";
import { AssertOTPError } from "../error";
import { OTPHandler } from "./OTPHandler";
import { authenticator } from "otplib";
import { baseParse } from "@lindorm-io/core";

MockDate.set("2020-01-01 08:00:00.000");

describe("OTPHandler", () => {
  let handler: OTPHandler;
  let aes: CryptoAES;
  let signature: string;
  let code: string;

  beforeEach(() => {
    handler = new OTPHandler({
      issuer: "issuer",
      secret: "secret",
    });
    aes = new CryptoAES({
      secret: "secret",
    });

    ({ signature } = handler.generate());
    code = authenticator.generate(aes.decrypt(baseParse(signature)));
  });

  test("should generate", () => {
    const result = handler.generate();

    expect(result.uri).toContain("otpauth://totp/issuer:");
    expect(result.uri).toContain("?secret=");
    expect(result.uri).toContain("&period=30&digits=6&algorithm=SHA1&issuer=issuer");

    expect(result.signature.length).toBe(88);
  });

  test("should verify", () => {
    expect(handler.verify(code, signature)).toStrictEqual({ success: true, timeRemaining: 30, timeUsed: 0 });
  });

  test("should resolve time remaining and used", () => {
    MockDate.set("2020-01-01 08:00:15.000");
    expect(handler.verify(code, signature)).toStrictEqual({ success: true, timeRemaining: 15, timeUsed: 15 });
  });

  test("should assert", () => {
    expect(handler.assert(code, signature)).toBe(undefined);
  });

  test("should throw error", () => {
    expect(() => handler.assert("wrong", signature)).toThrow(expect.any(AssertOTPError));
  });
});
