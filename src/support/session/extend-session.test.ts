import MockDate from "mockdate";
import { Account, Session } from "../../entity";
import { Client, InvalidClientError } from "@lindorm-io/koa-client";
import { InvalidDeviceError, InvalidRefreshTokenError } from "../../error";
import { extendSession } from "./extend-session";
import {
  getTestAccount,
  getTestClient,
  getTestRepository,
  getTestSession,
  inMemoryStore,
  resetStore,
} from "../../test";

jest.mock("uuid", () => ({
  v4: jest.fn(() => "be3a62d1-24a0-401c-96dd-3aff95356811"),
}));
jest.mock("./expires", () => ({
  assertSessionIsNotExpired: jest.fn(),
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
    session = getTestSession({ account, client });

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
    await ctx.repository.session.update(getTestSession({ deviceId: null }));
    ctx.metadata.deviceId = "e3585508-1355-4561-9548-da8a9f73480b";

    await expect(extendSession(ctx)()).resolves.toMatchSnapshot();

    expect(inMemoryStore).toMatchSnapshot();
  });

  test("should throw error when refreshId is wrong", async () => {
    ctx.token.refresh.id = "dd0a68cf-7f8c-4b3a-908a-35c5452421ae";

    await expect(extendSession(ctx)()).rejects.toStrictEqual(expect.any(InvalidRefreshTokenError));
  });

  test("should throw error when clientId is wrong", async () => {
    ctx.client = new Client({ id: "87e7c9a4-3c3b-4543-90c5-99254cfe342b" });

    await expect(extendSession(ctx)()).rejects.toStrictEqual(expect.any(InvalidClientError));
  });

  test("should throw error when deviceId is wrong", async () => {
    ctx.metadata.deviceId = "a4bcc8d9-ba46-4faf-99fc-bc1a40a6b2db";

    await expect(extendSession(ctx)()).rejects.toStrictEqual(expect.any(InvalidDeviceError));
  });
});
