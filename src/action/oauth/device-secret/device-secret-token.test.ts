import { MOCK_SESSION_OPTIONS } from "../../../test/mocks";
import { GrantType } from "../../../enum";
import { Session } from "../../../entity";
import { performDeviceSecretToken } from "./device-secret-token";

jest.mock("../../../support", () => ({
  assertDeviceChallenge: jest.fn(() => undefined),
  assertDeviceSecret: jest.fn(() => undefined),
  authenticateSession: jest.fn(() => () => "session"),
  createTokens: jest.fn(() => () => "tokens"),
  findOrCreateAccount: jest.fn(() => () => "account"),
  findValidSession: jest.fn(() => () => new Session(MOCK_SESSION_OPTIONS)),
}));

describe("performDeviceSecretToken", () => {
  let getMockContext: any;

  beforeEach(() => {
    getMockContext = () => ({
      client: "client",
      device: "device",
    });
  });

  test("should return tokens", async () => {
    await expect(
      performDeviceSecretToken(getMockContext())({
        codeVerifier: "codeVerifier",
        deviceVerifier: "deviceVerifier",
        grantType: GrantType.REFRESH_TOKEN,
        secret: "secret",
        subject: "email@lindorm.io",
      }),
    ).resolves.toMatchSnapshot();
  });
});
