import { Client, InvalidClientError } from "@lindorm-io/koa-client";
import { GrantType } from "../../../enum";
import { InvalidPermissionError, InvalidSubjectError } from "../../../error";
import { Permission } from "@lindorm-io/jwt";
import { performMultiFactorToken } from "./multi-factor-token";
import {
  getTestRepository,
  getTestAccount,
  getTestClient,
  resetStore,
  getTestCache,
  getTestAuthorization,
  resetCache,
} from "../../../test";

jest.mock("uuid", () => ({
  v4: jest.fn(() => "be3a62d1-24a0-401c-96dd-3aff95356811"),
}));
jest.mock("../../../support", () => ({
  assertAccountOTP: jest.fn(),
  assertAuthorizationIsNotExpired: jest.fn(),
  createSession: jest.fn(() => () => "session"),
  createTokens: jest.fn(() => () => "tokens"),
}));

describe("performMultiFactorToken", () => {
  let ctx: any;

  beforeEach(async () => {
    ctx = {
      cache: await getTestCache(),
      client: getTestClient(false),
      repository: await getTestRepository(),
      token: {
        multiFactor: {
          authMethodsReference: ["pwd"],
          subject: "4923fabc-aab2-4804-b92b-2aa96c4999a1",
        },
      },
    };

    await ctx.repository.account.create(getTestAccount("email@lindorm.io"));
    await ctx.cache.authorization.create(
      getTestAuthorization({
        client: ctx.client,
      }),
    );
  });

  afterEach(() => {
    resetCache();
    resetStore();
  });

  test("should return tokens", async () => {
    await expect(
      performMultiFactorToken(ctx)({
        bindingCode: "bindingCode",
        grantType: GrantType.REFRESH_TOKEN,
        subject: "email@lindorm.io",
      }),
    ).resolves.toMatchSnapshot();
  });

  test("should throw error on client mismatch", async () => {
    ctx.client = new Client({ id: "3af9b09e-51fa-4f84-9a47-e74bf0115148" });

    await expect(
      performMultiFactorToken(ctx)({
        bindingCode: "bindingCode",
        grantType: GrantType.REFRESH_TOKEN,
        subject: "email@lindorm.io",
      }),
    ).rejects.toStrictEqual(expect.any(InvalidClientError));
  });

  test("should throw error on subject mismatch", async () => {
    await expect(
      performMultiFactorToken(ctx)({
        bindingCode: "bindingCode",
        grantType: GrantType.REFRESH_TOKEN,
        subject: "wrong@lindorm.io",
      }),
    ).rejects.toStrictEqual(expect.any(InvalidSubjectError));
  });

  test("should throw error on locked account", async () => {
    const account = await ctx.repository.account.find({ email: "email@lindorm.io" });
    account.permission = Permission.LOCKED;
    await ctx.repository.account.update(account);

    await expect(
      performMultiFactorToken(ctx)({
        bindingCode: "bindingCode",
        grantType: GrantType.REFRESH_TOKEN,
        subject: "email@lindorm.io",
      }),
    ).rejects.toStrictEqual(expect.any(InvalidPermissionError));
  });
});
