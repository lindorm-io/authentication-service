import { Session } from "../../../entity";
import { MOCK_SESSION_OPTIONS } from "../../../test/mocks";
import { performDevicePINToken } from "./device-pin-token";
import { GrantType } from "../../../enum";

jest.mock("../../../support", () => ({
  assertDeviceChallenge: jest.fn(() => undefined),
  assertDevicePIN: jest.fn(() => undefined),
  authenticateSession: jest.fn(() => () => "session"),
  createTokens: jest.fn(() => () => "tokens"),
  findOrCreateAccount: jest.fn(() => () => "account"),
  findValidSession: jest.fn(() => () => new Session(MOCK_SESSION_OPTIONS)),
}));

describe("performDevicePINToken", () => {
  let getMockContext: any;

  beforeEach(() => {
    getMockContext = () => ({
      client: "client",
      device: "device",
    });
  });

  test("should return tokens", async () => {
    await expect(
      performDevicePINToken(getMockContext())({
        codeVerifier: "codeVerifier",
        deviceVerifier: "deviceVerifier",
        grantType: GrantType.REFRESH_TOKEN,
        pin: "pin",
        subject: "email@lindorm.io",
      }),
    ).resolves.toMatchSnapshot();
  });
});
