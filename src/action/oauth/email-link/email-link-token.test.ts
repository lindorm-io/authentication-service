import { GrantType } from "../../../enum";
import { performEmailLinkToken } from "./email-link-token";

jest.mock("../../../support", () => ({
  createSession: jest.fn(() => () => "session"),
  createTokens: jest.fn(() => () => "tokens"),
  findOrCreateAccount: jest.fn(() => () => "account"),
  validateAuthorization: jest.fn(() => () => ({
    responseType: "responseType",
  })),
}));

describe("performEmailLinkToken", () => {
  let ctx: any;

  beforeEach(() => {
    ctx = {
      client: "client",
    };
  });

  test("should return tokens", async () => {
    await expect(
      performEmailLinkToken(ctx)({
        codeVerifier: "codeVerifier",
        grantType: GrantType.REFRESH_TOKEN,
        subject: "email@lindorm.io",
      }),
    ).resolves.toMatchSnapshot();
  });
});
