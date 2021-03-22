import MockDate from "mockdate";
import { Account, Session } from "../../entity";
import { Client, InvalidClientError } from "@lindorm-io/koa-client";
import { GrantType } from "../../enum";
import { InvalidAuthorizationError, InvalidDeviceError, InvalidGrantTypeError, InvalidSubjectError } from "../../error";
import { findValidSession } from "./find-valid-session";
import {
  getTestRepository,
  getTestAccount,
  getTestClient,
  getTestSession,
  inMemoryStore,
  resetStore,
} from "../../test";

jest.mock("uuid", () => ({
  v4: jest.fn(() => "be3a62d1-24a0-401c-96dd-3aff95356811"),
}));
jest.mock("./challenge", () => ({
  assertCodeChallenge: jest.fn(() => undefined),
}));
jest.mock("./expires", () => ({
  assertSessionIsNotExpired: jest.fn(() => undefined),
}));

MockDate.set("2020-01-01 08:00:00.000");

describe("findValidSession", () => {
  let ctx: any;
  let account: Account;
  let client: Client;
  let session: Session;

  beforeEach(async () => {
    account = getTestAccount("email@lindorm.io");
    client = getTestClient();
    session = getTestSession(account, client, "H4LnTn7e1DltMsohJgIeKSNgpvppJ1qP6QRRD9Ai1pw=", "sha256");

    ctx = {
      client: client,
      metadata: { deviceId: session.deviceId },
      repository: await getTestRepository(),
      token: { authorization: { id: session.authorization.id, subject: session.id } },
    };

    await ctx.repository.session.create(session);
  });

  afterEach(resetStore);

  test("should find and validate session", async () => {
    await expect(
      findValidSession(ctx)({
        codeVerifier: "MHNnb24yMzBqZ2hvNDJuMDI5ajAyNGdt",
        grantType: GrantType.EMAIL_OTP,
        subject: "email@lindorm.io",
      }),
    ).resolves.toMatchSnapshot();

    expect(inMemoryStore).toMatchSnapshot();
  });

  test("should throw error when authorizationId is wrong", async () => {
    ctx.token.authorization.id = "wrong";

    await expect(
      findValidSession(ctx)({
        codeVerifier: "MHNnb24yMzBqZ2hvNDJuMDI5ajAyNGdt",
        grantType: GrantType.EMAIL_OTP,
        subject: "email@lindorm.io",
      }),
    ).rejects.toStrictEqual(expect.any(InvalidAuthorizationError));

    expect(inMemoryStore).toMatchSnapshot();
  });

  test("should throw error when clientId is wrong", async () => {
    ctx.client = new Client({ id: "wrong" });

    await expect(
      findValidSession(ctx)({
        codeVerifier: "MHNnb24yMzBqZ2hvNDJuMDI5ajAyNGdt",
        grantType: GrantType.EMAIL_OTP,
        subject: "email@lindorm.io",
      }),
    ).rejects.toStrictEqual(expect.any(InvalidClientError));

    expect(inMemoryStore).toMatchSnapshot();
  });

  test("should throw error when deviceId is wrong", async () => {
    ctx.metadata.deviceId = "wrong";

    await expect(
      findValidSession(ctx)({
        codeVerifier: "MHNnb24yMzBqZ2hvNDJuMDI5ajAyNGdt",
        grantType: GrantType.EMAIL_OTP,
        subject: "email@lindorm.io",
      }),
    ).rejects.toStrictEqual(expect.any(InvalidDeviceError));

    expect(inMemoryStore).toMatchSnapshot();
  });

  test("should throw error when grantType is wrong", async () => {
    await expect(
      findValidSession(ctx)({
        codeVerifier: "MHNnb24yMzBqZ2hvNDJuMDI5ajAyNGdt",
        grantType: GrantType.PASSWORD,
        subject: "email@lindorm.io",
      }),
    ).rejects.toStrictEqual(expect.any(InvalidGrantTypeError));

    expect(inMemoryStore).toMatchSnapshot();
  });

  test("should throw error when subject is wrong", async () => {
    await expect(
      findValidSession(ctx)({
        codeVerifier: "MHNnb24yMzBqZ2hvNDJuMDI5ajAyNGdt",
        grantType: GrantType.EMAIL_OTP,
        subject: "wrong",
      }),
    ).rejects.toStrictEqual(expect.any(InvalidSubjectError));

    expect(inMemoryStore).toMatchSnapshot();
  });
});
