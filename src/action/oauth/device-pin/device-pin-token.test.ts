import { GrantType } from "../../../enum";
import { getTestAccount, getTestRepository, resetStore } from "../../../test";
import { performDevicePINToken } from "./device-pin-token";
import { Account } from "../../../entity";

jest.mock("../../../support", () => ({
  createSession: jest.fn(() => () => "session"),
  createTokens: jest.fn(() => () => "tokens"),
  validateAuthorization: jest.fn(() => () => ({
    responseType: "responseType",
  })),
}));
jest.mock("../../../axios", () => ({
  requestVerifyDevicePIN: jest.fn(),
}));

describe("performDevicePINToken", () => {
  let ctx: any;
  let account: Account;

  beforeEach(async () => {
    ctx = {
      client: "client",
      metadata: {
        deviceId: "deb1abb0-a747-451e-bd82-7a2d89f950ac",
      },
      repository: await getTestRepository(),
    };

    account = await ctx.repository.account.create(getTestAccount("email@lindorm.io"));
  });

  afterEach(resetStore);

  test("should return tokens", async () => {
    await expect(
      performDevicePINToken(ctx)({
        certificateVerifier: "certificateVerifier",
        codeVerifier: "codeVerifier",
        deviceId: "deb1abb0-a747-451e-bd82-7a2d89f950ac",
        grantType: GrantType.REFRESH_TOKEN,
        pin: "pin",
        subject: account.email,
      }),
    ).resolves.toMatchSnapshot();
  });
});
