import MockDate from "mockdate";
import { Client } from "@lindorm-io/koa-client";
import { ITokenIssuerSignData } from "@lindorm-io/jwt";
import { getTestClient, getTestIssuer, logger } from "../../test";
import { verifyToken } from "./verify-token";

jest.mock("uuid", () => ({
  v4: jest.fn(() => "be3a62d1-24a0-401c-96dd-3aff95356811"),
}));

MockDate.set("2020-01-01 08:00:00.000");

describe("verifyToken", () => {
  let ctx: any;
  let client: Client;
  let signData: ITokenIssuerSignData;

  beforeEach(() => {
    const issuer = getTestIssuer();

    ctx = {
      logger,
      issuer: { tokenIssuer: issuer },
      metadata: { deviceId: "deviceId" },
    };

    client = getTestClient();

    signData = issuer.sign({
      audience: "audience",
      expiry: "5 minutes",
      subject: "subject",
      clientId: client.id,
    });
  });

  test("should verify token", () => {
    expect(
      verifyToken(ctx)({
        audience: "audience",
        client,
        token: signData.token,
      }),
    ).toMatchSnapshot();
  });

  test("should verify token without client", () => {
    expect(
      verifyToken(ctx)({
        audience: "audience",
        token: signData.token,
      }),
    ).toMatchSnapshot();
  });
});
