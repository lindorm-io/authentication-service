import { Client, InvalidClientError } from "@lindorm-io/koa-client";
import { GrantType, ResponseType } from "../../../enum";
import { InvalidPermissionError, InvalidSubjectError } from "../../../error";
import { Permission, Scope } from "@lindorm-io/jwt";
import { Session } from "../../../entity";
import { baseHash } from "@lindorm-io/core";
import { getTestRepository, getTestAccount, getTestClient, resetStore } from "../../../test";
import { performMultiFactorToken } from "./multi-factor-token";

jest.mock("uuid", () => ({
  v4: jest.fn(() => "be3a62d1-24a0-401c-96dd-3aff95356811"),
}));
jest.mock("../../../support", () => ({
  assertSessionIsNotExpired: jest.fn(),
  assertAccountOTP: jest.fn(),
  authenticateSession: jest.fn(() => () => "session"),
  createTokens: jest.fn(() => () => "tokens"),
  encryptClientSecret: jest.fn((input) => baseHash(input)),
}));

describe("performMultiFactorToken", () => {
  let ctx: any;

  beforeEach(async () => {
    ctx = {
      client: getTestClient(),
      repository: await getTestRepository(),
      token: {
        multiFactor: {
          authMethodsReference: "pwd",
          subject: "d22a19de-8d33-4dd2-8712-58af46490184",
        },
      },
    };

    await ctx.repository.account.create(getTestAccount("email@lindorm.io"));
    await ctx.repository.session.create(
      new Session({
        id: "d22a19de-8d33-4dd2-8712-58af46490184",
        authorization: {
          codeChallenge: "H4LnTn7e1DltMsohJgIeKSNgpvppJ1qP6QRRD9Ai1pw=",
          codeMethod: "sha256",
          email: "email@lindorm.io",
          id: "73b5a544-f0c6-429a-a327-6f1847f956e5",
          redirectUri: "https://lindorm.io",
          responseType: ResponseType.ACCESS,
        },
        clientId: ctx.client.id,
        expires: new Date("2999-12-12 12:12:12.000"),
        grantType: GrantType.PASSWORD,
        scope: [Scope.DEFAULT, Scope.EDIT, Scope.OPENID].join(" "),
      }),
    );
  });

  afterEach(resetStore);

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
