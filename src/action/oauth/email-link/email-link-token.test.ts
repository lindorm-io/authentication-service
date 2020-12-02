import { MOCK_SESSION_OPTIONS } from "../../../test/mocks";
import { GrantType } from "../../../enum";
import { Session } from "../../../entity";
import { performEmailLinkToken } from "./email-link-token";

jest.mock("../../../support", () => ({
  authenticateSession: jest.fn(() => () => "session"),
  createTokens: jest.fn(() => () => "tokens"),
  findOrCreateAccount: jest.fn(() => () => "account"),
  findValidSession: jest.fn(() => () => new Session(MOCK_SESSION_OPTIONS)),
}));

describe("performEmailLinkToken", () => {
  let getMockContext: any;

  beforeEach(() => {
    getMockContext = () => ({
      client: "client",
    });
  });

  test("should return tokens", async () => {
    await expect(
      performEmailLinkToken(getMockContext())({
        codeVerifier: "codeVerifier",
        grantType: GrantType.REFRESH_TOKEN,
        subject: "email@lindorm.io",
      }),
    ).resolves.toMatchSnapshot();
  });
});
