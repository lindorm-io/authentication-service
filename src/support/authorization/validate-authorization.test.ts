import MockDate from "mockdate";
import { Authorization } from "../../entity";
import { CacheEntityNotFoundError } from "@lindorm-io/redis";
import { Client, InvalidClientError } from "@lindorm-io/koa-client";
import { GrantType } from "../../enum";
import { InvalidDeviceError, InvalidGrantTypeError, InvalidSubjectError } from "../../error";
import { getTestAuthorization, getTestCache, getTestClient, inMemoryCache, resetStore } from "../../test";
import { validateAuthorization } from "./validate-authorization";

jest.mock("uuid", () => ({
  v4: jest.fn(() => "be3a62d1-24a0-401c-96dd-3aff95356811"),
}));
jest.mock("./code-challenge", () => ({
  assertCodeChallenge: jest.fn(),
}));
jest.mock("./expires", () => ({
  assertAuthorizationIsNotExpired: jest.fn(),
}));

MockDate.set("2020-01-01 08:00:00.000");

describe("validateAuthorization", () => {
  let ctx: any;
  let client: Client;
  let authorization: Authorization;

  beforeEach(async () => {
    client = getTestClient();
    authorization = getTestAuthorization({});

    ctx = {
      client: client,
      metadata: { deviceId: authorization.deviceId },
      cache: await getTestCache(),
      token: { authorization: { id: authorization.id } },
    };

    await ctx.cache.authorization.create(authorization);
  });

  afterEach(resetStore);

  test("should find and validate authorization", async () => {
    await expect(
      validateAuthorization(ctx)({
        codeVerifier: "MHNnb24yMzBqZ2hvNDJuMDI5ajAyNGdt",
        grantType: GrantType.EMAIL_OTP,
        email: "email@lindorm.io",
      }),
    ).resolves.toMatchSnapshot();

    expect(inMemoryCache).toMatchSnapshot();
  });

  test("should throw error when authorizationId is wrong", async () => {
    ctx.token.authorization.id = "wrong";

    await expect(
      validateAuthorization(ctx)({
        codeVerifier: "MHNnb24yMzBqZ2hvNDJuMDI5ajAyNGdt",
        grantType: GrantType.EMAIL_OTP,
        email: "email@lindorm.io",
      }),
    ).rejects.toStrictEqual(expect.any(CacheEntityNotFoundError));

    expect(inMemoryCache).toMatchSnapshot();
  });

  test("should throw error when clientId is wrong", async () => {
    ctx.client = new Client({ id: "wrong" });

    await expect(
      validateAuthorization(ctx)({
        codeVerifier: "MHNnb24yMzBqZ2hvNDJuMDI5ajAyNGdt",
        grantType: GrantType.EMAIL_OTP,
        email: "email@lindorm.io",
      }),
    ).rejects.toStrictEqual(expect.any(InvalidClientError));

    expect(inMemoryCache).toMatchSnapshot();
  });

  test("should throw error when deviceId is wrong", async () => {
    ctx.metadata.deviceId = "wrong";

    await expect(
      validateAuthorization(ctx)({
        codeVerifier: "MHNnb24yMzBqZ2hvNDJuMDI5ajAyNGdt",
        grantType: GrantType.EMAIL_OTP,
        email: "email@lindorm.io",
      }),
    ).rejects.toStrictEqual(expect.any(InvalidDeviceError));

    expect(inMemoryCache).toMatchSnapshot();
  });

  test("should throw error when grantType is wrong", async () => {
    await expect(
      validateAuthorization(ctx)({
        codeVerifier: "MHNnb24yMzBqZ2hvNDJuMDI5ajAyNGdt",
        grantType: GrantType.PASSWORD,
        email: "email@lindorm.io",
      }),
    ).rejects.toStrictEqual(expect.any(InvalidGrantTypeError));

    expect(inMemoryCache).toMatchSnapshot();
  });

  test("should throw error when email is wrong", async () => {
    await expect(
      validateAuthorization(ctx)({
        codeVerifier: "MHNnb24yMzBqZ2hvNDJuMDI5ajAyNGdt",
        grantType: GrantType.EMAIL_OTP,
        email: "wrong",
      }),
    ).rejects.toStrictEqual(expect.any(InvalidSubjectError));

    expect(inMemoryCache).toMatchSnapshot();
  });
});
