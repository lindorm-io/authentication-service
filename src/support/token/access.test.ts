import MockDate from "mockdate";
import { Account } from "../../entity";
import { Client } from "@lindorm-io/koa-client";
import { getAccessToken } from "./access";
import { getTestAccount, getTestClient, getTestIssuer, logger } from "../../test";

jest.mock("jsonwebtoken", () => ({
  sign: (data: any) => data,
}));
jest.mock("uuid", () => ({
  v4: jest.fn(() => "be3a62d1-24a0-401c-96dd-3aff95356811"),
}));

MockDate.set("2020-01-01 08:00:00.000");

describe("getAccessToken", () => {
  let ctx: any;
  let account: Account;
  let client: Client;

  beforeEach(() => {
    ctx = {
      logger,
      issuer: { tokenIssuer: getTestIssuer() },
      metadata: { deviceId: "deviceId" },
    };

    account = getTestAccount("email@lindorm.io");
    client = getTestClient();
  });

  test("should return an access token", () => {
    expect(
      getAccessToken(ctx)({
        account,
        authMethodsReference: ["authMethodsReference"],
        client,
        scope: ["scope"],
      }),
    ).toMatchSnapshot();
  });
});
