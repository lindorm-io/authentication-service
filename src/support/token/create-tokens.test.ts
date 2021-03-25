import MockDate from "mockdate";
import { Account, Session } from "../../entity";
import { Client } from "@lindorm-io/koa-client";
import { ResponseType } from "../../enum";
import { createTokens } from "./create-tokens";
import { getTestRepository, getTestAccount, getTestClient, getTestIssuer, getTestSession, logger } from "../../test";

jest.mock("uuid", () => ({
  v4: jest.fn(() => "be3a62d1-24a0-401c-96dd-3aff95356811"),
}));
jest.mock("./access", () => ({
  getAccessToken: jest.fn(() => () => "accessToken"),
}));
jest.mock("./identity", () => ({
  getIdentityToken: jest.fn(() => () => "identityToken"),
}));
jest.mock("./refresh", () => ({
  getRefreshToken: jest.fn(() => () => "refreshToken"),
}));

MockDate.set("2020-01-01 08:00:00.000");

describe("createTokens", () => {
  let ctx: any;
  let account: Account;
  let client: Client;
  let session: Session;

  beforeEach(async () => {
    ctx = {
      logger,
      issuer: { tokenIssuer: getTestIssuer() },
      metadata: { deviceId: "deviceId" },
      repository: await getTestRepository(),
    };

    account = getTestAccount("email@lindorm.io");
    client = getTestClient();
    session = getTestSession(account, client, "codeChallenge", "codeMethod");
  });

  test("should return refresh token", async () => {
    await expect(
      createTokens(ctx)({
        account,
        authMethodsReference: "authMethodsReference",
        client,
        responseType: ResponseType.REFRESH,
        session,
      }),
    ).resolves.toMatchSnapshot();
  });

  test("should return access token", async () => {
    await expect(
      createTokens(ctx)({
        account,
        authMethodsReference: "authMethodsReference",
        client,
        responseType: ResponseType.ACCESS,
        session,
      }),
    ).resolves.toMatchSnapshot();
  });

  test("should return identity token", async () => {
    await expect(
      createTokens(ctx)({
        account,
        authMethodsReference: "authMethodsReference",
        client,
        responseType: ResponseType.IDENTITY,
        session,
      }),
    ).resolves.toMatchSnapshot();
  });

  test("should return all tokens", async () => {
    await expect(
      createTokens(ctx)({
        account,
        authMethodsReference: "authMethodsReference",
        client,
        responseType: `${ResponseType.REFRESH} ${ResponseType.ACCESS} ${ResponseType.IDENTITY}`,
        session,
      }),
    ).resolves.toMatchSnapshot();
  });
});
