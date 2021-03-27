import MockDate from "mockdate";
import { Authorization } from "../../entity";
import { Client } from "@lindorm-io/koa-client";
import { getMultiFactorToken } from "./multi-factor";
import { getTestClient, getTestIssuer, getTestMetadata, getTestAuthorization, logger } from "../../test";

jest.mock("jsonwebtoken", () => ({
  sign: (data: any) => data,
}));
jest.mock("uuid", () => ({
  v4: jest.fn(() => "be3a62d1-24a0-401c-96dd-3aff95356811"),
}));

MockDate.set("2020-01-01 08:00:00.000");

describe("getMultiFactorToken", () => {
  let ctx: any;
  let client: Client;
  let authorization: Authorization;

  beforeEach(() => {
    ctx = {
      logger,
      issuer: { tokenIssuer: getTestIssuer() },
      metadata: getTestMetadata(),
    };

    client = getTestClient();
    authorization = getTestAuthorization({
      client,
    });
  });

  test("should return a multi-factor token", () => {
    expect(
      getMultiFactorToken(ctx)({
        authMethodsReference: ["authMethodsReference"],
        client,
        authorization,
      }),
    ).toMatchSnapshot();
  });
});
