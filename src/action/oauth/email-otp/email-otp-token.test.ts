import { MOCK_SESSION_OPTIONS } from "../../../test/mocks";
import { GrantType } from "../../../enum";
import { Session } from "../../../entity";
import { performEmailOTPToken } from "./email-otp-token";

jest.mock("../../../support", () => ({
  assertSessionOTP: jest.fn(() => undefined),
  authenticateSession: jest.fn(() => () => "session"),
  createTokens: jest.fn(() => () => "tokens"),
  findOrCreateAccount: jest.fn(() => () => "account"),
  findValidSession: jest.fn(() => () => new Session(MOCK_SESSION_OPTIONS)),
}));

describe("performEmailOTPToken", () => {
  let getMockContext: any;

  beforeEach(() => {
    getMockContext = () => ({
      client: "client",
    });
  });

  test("should return tokens", async () => {
    await expect(
      performEmailOTPToken(getMockContext())({
        codeVerifier: "codeVerifier",
        grantType: GrantType.REFRESH_TOKEN,
        otpCode: "otpCode",
        subject: "email@lindorm.io",
      }),
    ).resolves.toMatchSnapshot();
  });
});
