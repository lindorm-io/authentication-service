import MockDate from "mockdate";
import { Account, Session } from "../../entity";
import { extendSession } from "./extend-session";
import { InvalidDeviceError, InvalidRefreshTokenError } from "../../error";
import { Client, InvalidClientError } from "@lindorm-io/koa-client";
import { getTestRepository, getTestAccount, getTestClient, inMemoryStore, resetStore } from "../../test";
import { v4 as uuid } from "uuid";
import { GrantType, ResponseType } from "../../enum";
import { Scope } from "@lindorm-io/jwt";

jest.mock("uuid", () => ({
  v4: jest.fn(() => "be3a62d1-24a0-401c-96dd-3aff95356811"),
}));
jest.mock("./expires", () => ({
  assertSessionIsNotExpired: jest.fn(() => undefined),
  getSessionExpires: jest.fn(() => new Date()),
}));

MockDate.set("2020-01-01 08:00:00.000");

describe("extendSession", () => {
  let ctx: any;
  let account: Account;
  let client: Client;
  let session: Session;

  beforeEach(async () => {
    account = getTestAccount("email@lindorm.io");
    client = getTestClient();
    session = new Session({
      accountId: account.id,
      authenticated: true,
      authorization: {
        codeChallenge: "H4LnTn7e1DltMsohJgIeKSNgpvppJ1qP6QRRD9Ai1pw=",
        codeMethod: "sha256",
        email: account.email,
        id: uuid(),
        redirectUri: "https://redirect.uri/",
        responseType: ResponseType.REFRESH,
      },
      clientId: client.id,
      deviceId: "11388709-2ced-4c53-8f17-7cf867c01432",
      expires: new Date("2099-01-01"),
      grantType: GrantType.EMAIL_OTP,
      refreshId: uuid(),
      scope: [Scope.DEFAULT, Scope.EDIT, Scope.OPENID].join(" "),
    });

    ctx = {
      client: client,
      metadata: { deviceId: session.deviceId },
      repository: await getTestRepository(),
      token: { refresh: { id: session.refreshId, subject: session.id } },
    };

    await ctx.repository.session.create(session);
  });

  afterEach(resetStore);

  test("should extend session with refresh token", async () => {
    await expect(extendSession(ctx)()).resolves.toMatchSnapshot();

    expect(inMemoryStore).toMatchSnapshot();
  });

  test("should skip deviceId when not set on session", async () => {
    session = new Session({
      accountId: account.id,
      authenticated: true,
      authorization: {
        codeChallenge: "H4LnTn7e1DltMsohJgIeKSNgpvppJ1qP6QRRD9Ai1pw=",
        codeMethod: "sha256",
        email: account.email,
        id: uuid(),
        redirectUri: "https://redirect.uri/",
        responseType: ResponseType.REFRESH,
      },
      clientId: client.id,
      expires: new Date("2099-01-01"),
      grantType: GrantType.EMAIL_OTP,
      refreshId: uuid(),
      scope: [Scope.DEFAULT, Scope.EDIT, Scope.OPENID].join(" "),
    });
    await ctx.repository.session.update(session);
    ctx.metadata.deviceId = "wrong";

    await expect(extendSession(ctx)()).resolves.toMatchSnapshot();

    expect(inMemoryStore).toMatchSnapshot();
  });

  test("should throw error when refreshId is wrong", async () => {
    ctx.token.refresh.id = "wrong";

    await expect(extendSession(ctx)()).rejects.toStrictEqual(expect.any(InvalidRefreshTokenError));
  });

  test("should throw error when clientId is wrong", async () => {
    ctx.client = new Client({ id: "wrong" });

    await expect(extendSession(ctx)()).rejects.toStrictEqual(expect.any(InvalidClientError));
  });

  test("should throw error when deviceId is wrong", async () => {
    ctx.metadata.deviceId = "wrong";

    await expect(extendSession(ctx)()).rejects.toStrictEqual(expect.any(InvalidDeviceError));
  });
});
