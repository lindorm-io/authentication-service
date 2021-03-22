import { GrantType, ResponseType } from "../../../enum";
import { performEmailOTPToken } from "./email-otp-token";

jest.mock("../../../support", () => ({
  assertSessionOTP: jest.fn(() => undefined),
  authenticateSession: jest.fn(() => () => "session"),
  createTokens: jest.fn(() => () => "tokens"),
  findOrCreateAccount: jest.fn(() => () => "account"),
  findValidSession: jest.fn(() => () => ({
    authorization: {
      email: "email@lindorm.io",
      responseType: ResponseType.REFRESH,
    },
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
