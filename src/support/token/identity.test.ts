import MockDate from "mockdate";
import { Account } from "../../entity";
import { Client } from "@lindorm-io/koa-client";
import { getIdentityToken } from "./identity";
import { getTestAccount, getTestClient, getTestIssuer, logger } from "../../test";

jest.mock("jsonwebtoken", () => ({
  sign: (data: any) => data,
}));
jest.mock("uuid", () => ({
  v4: jest.fn(() => "be3a62d1-24a0-401c-96dd-3aff95356811"),
}));
jest.mock("../../axios", () => ({
  requestOpenIdClaims: jest.fn(() => () => ({
    claim1: "claim1",
    claim2: "claim2",
  })),
}));

MockDate.set("2020-01-01 08:00:00.000");

describe("getIdentityToken", () => {
  let ctx: any;
  let account: Account;
  let client: Client;

  beforeEach(() => {
    ctx = {
      logger,
      issuer: { auth: getTestIssuer() },
      metadata: { deviceId: "deviceId" },
    };

    account = getTestAccount("email@lindorm.io");
    client = getTestClient();
  });

  test("should return an identity token", async () => {
    await expect(
      getIdentityToken(ctx)({
        account,
        client,
        scope: ["scope"],
      }),
    ).resolves.toMatchSnapshot();
  });
});
