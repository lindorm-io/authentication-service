import { GrantType, ResponseType } from "../../../enum";
import { Permission } from "@lindorm-io/jwt";
import { performRefreshToken } from "./refresh-token";
import { InvalidPermissionError, InvalidRefreshTokenError, InvalidSubjectError } from "../../../error";
import { getTestRepository, getTestAccount, resetStore } from "../../../test";

jest.mock("uuid", () => ({
  v4: jest.fn(() => "be3a62d1-24a0-401c-96dd-3aff95356811"),
}));
jest.mock("../../../support", () => ({
  createTokens: jest.fn(() => () => "tokens"),
  extendSession: jest.fn(() => () => ({ accountId: "be3a62d1-24a0-401c-96dd-3aff95356811" })),
}));

describe("performRefreshToken", () => {
  let ctx: any;

  beforeEach(async () => {
    ctx = {
      client: "client",
      repository: await getTestRepository(),
      token: { refresh: { authMethodsReference: ["authMethodsReference"], permission: Permission.USER } },
    };

    await ctx.repository.account.create(getTestAccount("email@lindorm.io"));
  });

  afterEach(resetStore);

  test("should return tokens", async () => {
    await expect(
      performRefreshToken(ctx)({
        grantType: GrantType.REFRESH_TOKEN,
        responseType: ResponseType.REFRESH,
        subject: "email@lindorm.io",
      }),
    ).resolves.toBe("tokens");
  });

  test("should throw error when account is locked", async () => {
    const account = await ctx.repository.account.find({ email: "email@lindorm.io" });
    account.permission = Permission.LOCKED;
    await ctx.repository.account.update(account);

    await expect(
      performRefreshToken(ctx)({
        grantType: GrantType.REFRESH_TOKEN,
        responseType: ResponseType.REFRESH,
        subject: "email@lindorm.io",
      }),
    ).rejects.toStrictEqual(expect.any(InvalidPermissionError));
  });

  test("should throw error when permission is mismatched", async () => {
    ctx.token.refresh.permission = "permission";

    await expect(
      performRefreshToken(ctx)({
        grantType: GrantType.REFRESH_TOKEN,
        responseType: ResponseType.REFRESH,
        subject: "email@lindorm.io",
      }),
    ).rejects.toStrictEqual(expect.any(InvalidRefreshTokenError));
  });

  test("should throw error when email is mismatched", async () => {
    await expect(
      performRefreshToken(ctx)({
        grantType: GrantType.REFRESH_TOKEN,
        responseType: ResponseType.REFRESH,
        subject: "wrong@lindorm.io",
      }),
    ).rejects.toStrictEqual(expect.any(InvalidSubjectError));
  });
});
