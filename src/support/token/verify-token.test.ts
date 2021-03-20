import MockDate from "mockdate";
import { Client } from "@lindorm-io/koa-client";
import { ITokenIssuerSignData } from "@lindorm-io/jwt";
import { MOCK_CLIENT_OPTIONS, MOCK_EC_TOKEN_ISSUER, MOCK_LOGGER } from "../../test/mocks";
import { verifyToken } from "./verify-token";

jest.mock("uuid", () => ({
  v4: jest.fn(() => "be3a62d1-24a0-401c-96dd-3aff95356811"),
}));

MockDate.set("2020-01-01 08:00:00.000");

describe("verifyToken", () => {
  let getMockContext: any;

  let client: Client;
  let signData: ITokenIssuerSignData;

  beforeEach(() => {
    getMockContext = () => ({
      logger: MOCK_LOGGER,
      issuer: { tokenIssuer: MOCK_EC_TOKEN_ISSUER },
      metadata: { deviceId: "deviceId" },
    });

    client = new Client(MOCK_CLIENT_OPTIONS);

    signData = MOCK_EC_TOKEN_ISSUER.sign({
      audience: "audience",
      expiry: "5 minutes",
      subject: "subject",
      clientId: client.id,
    });
  });

  test("should verify token", () => {
    expect(
      verifyToken(getMockContext())({
        audience: "audience",
        client,
        token: signData.token,
      }),
    ).toMatchSnapshot();
  });

  test("should verify token without client", () => {
    expect(
      verifyToken(getMockContext())({
        audience: "audience",
        token: signData.token,
      }),
    ).toMatchSnapshot();
  });

  test("should verify token without device", () => {
    expect(
      verifyToken(getMockContext())({
        audience: "audience",
        client,
        token: signData.token,
      }),
    ).toMatchSnapshot();
  });
});
