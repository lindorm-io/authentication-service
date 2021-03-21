import MockDate from "mockdate";
import { Account, Session } from "../../entity";
import { Client } from "@lindorm-io/koa-client";
import { InvalidAuthorizationTokenError } from "../../error";
import { authenticateSession } from "./authenticate-session";
import { getGreyBoxRepository, getTestAccount, getTestClient, getTestSession, inMemoryStore } from "../../test";

jest.mock("uuid", () => ({
  v4: jest.fn(() => "be3a62d1-24a0-401c-96dd-3aff95356811"),
}));
jest.mock("./expires", () => ({
  getSessionExpires: jest.fn(() => new Date()),
}));

MockDate.set("2020-01-01 08:00:00.000");

describe("authenticateSession", () => {
  let ctx: any;

  let account: Account;
  let client: Client;
  let session: Session;

  beforeEach(async () => {
    client = getTestClient();

    ctx = {
      client,
      repository: await getGreyBoxRepository(),
    };

    account = getTestAccount("email@lindorm.io");
    session = getTestSession(account, client, "H4LnTn7e1DltMsohJgIeKSNgpvppJ1qP6QRRD9Ai1pw=", "sha256");
    session.authenticated = false;

    await ctx.repository.session.create(session);
  });

  test("should authenticate session and update", async () => {
    await expect(authenticateSession(ctx)({ account, session })).resolves.toMatchSnapshot();

    expect(inMemoryStore).toMatchSnapshot();
  });

  test("should throw error if session has already been authenticated", async () => {
    session.authenticated = true;

    await expect(authenticateSession(ctx)({ account, session })).rejects.toStrictEqual(
      expect.any(InvalidAuthorizationTokenError),
    );
  });
});
