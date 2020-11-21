import MockDate from "mockdate";
import { getAuthorizationToken } from "./authorization";
import { Device, Session } from "../../entity";
import {
  MOCK_CLIENT_OPTIONS,
  MOCK_DEVICE_OPTIONS,
  MOCK_SESSION_OPTIONS,
  MOCK_EC_TOKEN_ISSUER,
  MOCK_LOGGER,
} from "../../test/mocks";
import { Client } from "@lindorm-io/koa-client";

jest.mock("uuid", () => ({
  v4: jest.fn(() => "be3a62d1-24a0-401c-96dd-3aff95356811"),
}));

MockDate.set("2020-01-01 08:00:00.000");

describe("getAuthorizationToken", () => {
  let getMockContext: any;

  let client: Client;
  let device: Device;
  let session: Session;

  beforeEach(() => {
    getMockContext = () => ({
      logger: MOCK_LOGGER,
      issuer: { tokenIssuer: MOCK_EC_TOKEN_ISSUER },
    });

    client = new Client(MOCK_CLIENT_OPTIONS);
    device = new Device(MOCK_DEVICE_OPTIONS);
    session = new Session(MOCK_SESSION_OPTIONS);
  });

  test("should return an authorization token", () => {
    expect(
      getAuthorizationToken(getMockContext())({
        client,
        device,
        session,
      }),
    ).toStrictEqual({
      expires: 32501992332,
      expiresIn: 30924130332,
      id: "authorizationId",
      level: undefined,
      token: expect.any(String),
    });
  });

  test("should return an authorization token without device", () => {
    expect(
      getAuthorizationToken(getMockContext())({
        client,
        session,
      }),
    ).toStrictEqual({
      expires: 32501992332,
      expiresIn: 30924130332,
      id: "authorizationId",
      level: undefined,
      token: expect.any(String),
    });
  });
});
