import { Account } from "../../../entity";
import { GrantType } from "../../../enum";
import { getTestAccount, getTestRepository, resetStore } from "../../../test";
import { performDeviceSecretToken } from "./device-secret-token";

jest.mock("../../../support", () => ({
  createSession: jest.fn(() => () => "session"),
  createTokens: jest.fn(() => () => "tokens"),
  validateAuthorization: jest.fn(() => () => ({
    responseType: "responseType",
  })),
}));
jest.mock("../../../axios", () => ({
  requestVerifyDeviceSecret: jest.fn(),
}));

describe("performDeviceSecretToken", () => {
  let ctx: any;
  let account: Account;

  beforeEach(async () => {
    ctx = {
      client: "client",
      metadata: {
        deviceId: "96fd2bc9-90d7-41c1-a595-e3a3efe6fb3c",
      },
      repository: await getTestRepository(),
    };

    account = await ctx.repository.account.create(getTestAccount("email@lindorm.io"));
  });

  afterEach(resetStore);

  test("should return tokens", async () => {
    await expect(
      performDeviceSecretToken(ctx)({
        certificateVerifier: "certificateVerifier",
        codeVerifier: "codeVerifier",
        deviceId: "96fd2bc9-90d7-41c1-a595-e3a3efe6fb3c",
        grantType: GrantType.REFRESH_TOKEN,
        secret: "secret",
        subject: account.email,
      }),
    ).resolves.toMatchSnapshot();
  });
});
