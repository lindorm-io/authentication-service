import { Account, Session } from "../../../entity";
import { GrantType } from "../../../enum";
import { MOCK_SESSION_OPTIONS } from "../../../test/mocks";
import { getGreyBoxRepository, resetStore } from "../../../test";
import { performDevicePINToken } from "./device-pin-token";

jest.mock("../../../support", () => ({
  authenticateSession: jest.fn(() => () => "session"),
  createTokens: jest.fn(() => () => "tokens"),
  findValidSession: jest.fn(() => () => new Session(MOCK_SESSION_OPTIONS)),
}));
jest.mock("../../../axios", () => ({
  verifyDevicePIN: jest.fn(),
}));

describe("performDevicePINToken", () => {
  let ctx: any;

  beforeEach(async () => {
    ctx = {
      client: "client",
      metadata: {
        deviceId: "deb1abb0-a747-451e-bd82-7a2d89f950ac",
      },
      repository: await getGreyBoxRepository(),
    };

    await ctx.repository.account.create(
      new Account({
        email: "email@lindorm.io",
      }),
    );
  });

  afterEach(resetStore);

  test("should return tokens", async () => {
    await expect(
      performDevicePINToken(ctx)({
        codeVerifier: "codeVerifier",
        deviceId: "deb1abb0-a747-451e-bd82-7a2d89f950ac",
        deviceVerifier: "deviceVerifier",
        grantType: GrantType.REFRESH_TOKEN,
        pin: "pin",
        subject: "email@lindorm.io",
      }),
    ).resolves.toMatchSnapshot();
  });
});
