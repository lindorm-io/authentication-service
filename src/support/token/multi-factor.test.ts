import MockDate from "mockdate";
import { Client } from "@lindorm-io/koa-client";
import { Session } from "../../entity";
import { getMultiFactorToken } from "./multi-factor";
import { getTestAccount, getTestClient, getTestIssuer, getTestSession, logger } from "../../test";

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
  let session: Session;

  beforeEach(() => {
    ctx = {
      logger,
      issuer: { tokenIssuer: getTestIssuer() },
      metadata: { deviceId: "deviceId" },
    };

    client = getTestClient();
    session = getTestSession(getTestAccount("email@lindorm.io"), client, "codeChallenge", "codeMethod");
  });

  test("should return a multi-factor token", () => {
    expect(
      getMultiFactorToken(ctx)({
        authMethodsReference: ["authMethodsReference"],
        client,
        session,
      }),
    ).toMatchSnapshot();
  });
});
