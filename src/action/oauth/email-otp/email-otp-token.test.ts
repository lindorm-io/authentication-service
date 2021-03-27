import { GrantType } from "../../../enum";
import { performEmailOTPToken } from "./email-otp-token";

jest.mock("../../../support", () => ({
  assertAuthorizationOTP: jest.fn(),
  createSession: jest.fn(() => () => "session"),
  createTokens: jest.fn(() => () => "tokens"),
  findOrCreateAccount: jest.fn(() => () => "account"),
  validateAuthorization: jest.fn(() => () => ({
    responseType: "responseType",
  })),
}));

describe("performEmailOTPToken", () => {
  let ctx: any;

  beforeEach(() => {
    ctx = {
      client: "client",
    };
  });

  test("should return tokens", async () => {
    await expect(
      performEmailOTPToken(ctx)({
        codeVerifier: "codeVerifier",
        grantType: GrantType.REFRESH_TOKEN,
        otpCode: "otpCode",
        subject: "email@lindorm.io",
      }),
    ).resolves.toMatchSnapshot();
  });
});
