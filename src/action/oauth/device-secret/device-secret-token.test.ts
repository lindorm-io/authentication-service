import { Account, Session } from "../../../entity";
import { GrantType } from "../../../enum";
import { MOCK_SESSION_OPTIONS } from "../../../test/mocks";
import { getGreyBoxRepository, resetStore } from "../../../test";
import { performDeviceSecretToken } from "./device-secret-token";

jest.mock("../../../support", () => ({
  authenticateSession: jest.fn(() => () => "session"),
  createTokens: jest.fn(() => () => "tokens"),
  findValidSession: jest.fn(() => () => new Session(MOCK_SESSION_OPTIONS)),
}));
jest.mock("../../../axios", () => ({
  verifyDeviceSecret: jest.fn(),
}));

describe("performDeviceSecretToken", () => {
  let ctx: any;

  beforeEach(async () => {
    ctx = {
      client: "client",
      metadata: {
        deviceId: "96fd2bc9-90d7-41c1-a595-e3a3efe6fb3c",
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
      performDeviceSecretToken(ctx)({
        codeVerifier: "codeVerifier",
        deviceId: "96fd2bc9-90d7-41c1-a595-e3a3efe6fb3c",
        deviceVerifier: "deviceVerifier",
        grantType: GrantType.REFRESH_TOKEN,
        secret: "secret",
        subject: "email@lindorm.io",
      }),
    ).resolves.toMatchSnapshot();
  });
});
