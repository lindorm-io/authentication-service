import { GrantType } from "../../../enum";
import { performPasswordToken } from "./password-token";
import { getTestRepository, getTestAccountWithOTP, getTestAccountWithPassword, resetStore } from "../../../test";
import { baseHash } from "@lindorm-io/core";

jest.mock("../../../support", () => ({
  assertAccountPassword: jest.fn(() => {}),
  createSession: jest.fn(() => () => "session"),
  createTokens: jest.fn(() => () => "tokens"),
  encryptAccountPassword: jest.fn((input) => baseHash(input)),
  getMultiFactorToken: jest.fn(() => () => "multi-factor-token"),
  validateAuthorization: jest.fn(() => () => ({
    responseType: "responseType",
  })),
}));

describe("performPasswordToken", () => {
  let ctx: any;

  beforeEach(async () => {
    ctx = {
      client: "client",
      repository: await getTestRepository(),
    };
  });

  afterEach(resetStore);

  test("should return tokens", async () => {
    await ctx.repository.account.create(await getTestAccountWithPassword("email@lindorm.io"));

    await expect(
      performPasswordToken(ctx)({
        codeVerifier: "codeVerifier",
        grantType: GrantType.REFRESH_TOKEN,
        password: "password",
        subject: "email@lindorm.io",
      }),
    ).resolves.toBe("tokens");
  });

  test("should return multi-factor token", async () => {
    await ctx.repository.account.create(
      await getTestAccountWithOTP("email@lindorm.io", { signature: baseHash("signature"), uri: "https://lindorm.io/" }),
    );

    await expect(
      performPasswordToken(ctx)({
        codeVerifier: "codeVerifier",
        grantType: GrantType.REFRESH_TOKEN,
        password: "password",
        subject: "email@lindorm.io",
      }),
    ).resolves.toMatchSnapshot();
  });
});
