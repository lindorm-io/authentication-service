import MockDate from "mockdate";
import { Client } from "@lindorm-io/koa-client";
import { Authorization } from "../../entity";
import { getAuthorizationToken } from "./authorization";
import { getTestClient, getTestIssuer, getTestAuthorization, logger } from "../../test";

jest.mock("jsonwebtoken", () => ({
  sign: (data: any) => data,
}));
jest.mock("uuid", () => ({
  v4: jest.fn(() => "be3a62d1-24a0-401c-96dd-3aff95356811"),
}));

MockDate.set("2020-01-01 08:00:00.000");

describe("getAuthorizationToken", () => {
  let ctx: any;
  let client: Client;
  let authorization: Authorization;

  beforeEach(() => {
    ctx = {
      logger,
      issuer: { auth: getTestIssuer() },
      metadata: { deviceId: "deviceId" },
    };

    client = getTestClient();
    authorization = getTestAuthorization({
      client,
      codeChallenge: "codeChallenge",
      codeMethod: "codeMethod",
      email: "email@lindorm.io",
    });
  });

  test("should return an authorization token", () => {
    expect(
      getAuthorizationToken(ctx)({
        authorization,
        client,
      }),
    ).toMatchSnapshot();
  });
});
