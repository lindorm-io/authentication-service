import MockDate from "mockdate";
import { Account, Session } from "../../entity";
import { Client } from "@lindorm-io/koa-client";
import { getRefreshToken } from "./refresh";
import { getTestAccount, getTestClient, getTestIssuer, getTestSession, logger } from "../../test";

jest.mock("jsonwebtoken", () => ({
  sign: (data: any) => data,
}));
jest.mock("uuid", () => ({
  v4: jest.fn(() => "be3a62d1-24a0-401c-96dd-3aff95356811"),
}));

MockDate.set("2020-01-01 08:00:00.000");

describe("getRefreshToken", () => {
  let ctx: any;
  let account: Account;
  let client: Client;
  let session: Session;

  beforeEach(() => {
    ctx = {
      logger,
      issuer: { tokenIssuer: getTestIssuer() },
      metadata: { deviceId: "deviceId" },
    };

    account = getTestAccount("email@lindorm.io");
    client = getTestClient();
    session = getTestSession(account, client, "codeChallenge", "codeMethod");
  });

  test("should return a refresh token", () => {
    expect(
      getRefreshToken(ctx)({
        account,
        authMethodsReference: "authMethodsReference",
        client,
        scope: "scope",
        session,
      }),
    ).toMatchSnapshot();
  });
});
