import { GrantType, ResponseType } from "../../../enum";
import { getTestRepository, getTestAccount, resetStore } from "../../../test";
import { performDevicePINToken } from "./device-pin-token";

jest.mock("../../../support", () => ({
  authenticateSession: jest.fn(() => () => "session"),
  createTokens: jest.fn(() => () => "tokens"),
  findValidSession: jest.fn(() => () => ({
    authorization: {
      email: "email@lindorm.io",
      responseType: ResponseType.REFRESH,
    },
  })),
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
      repository: await getTestRepository(),
    };

    await ctx.repository.account.create(getTestAccount("email@lindorm.io"));
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
