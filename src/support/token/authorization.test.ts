import MockDate from "mockdate";
import { Client } from "@lindorm-io/koa-client";
import { MOCK_CLIENT_OPTIONS, MOCK_SESSION_OPTIONS, MOCK_EC_TOKEN_ISSUER } from "../../test/mocks";
import { Session } from "../../entity";
import { getAuthorizationToken } from "./authorization";
import { winston } from "../../logger";

jest.mock("jsonwebtoken", () => ({
  sign: (data: any) => data,
}));
jest.mock("uuid", () => ({
  v4: jest.fn(() => "be3a62d1-24a0-401c-96dd-3aff95356811"),
}));

MockDate.set("2020-01-01 08:00:00.000");

describe("getAuthorizationToken", () => {
  let getMockContext: any;

  let client: Client;
  let session: Session;

  beforeEach(() => {
    getMockContext = () => ({
      logger: winston,
      issuer: { tokenIssuer: MOCK_EC_TOKEN_ISSUER },
      metadata: { deviceId: "deviceId" },
    });

    client = new Client(MOCK_CLIENT_OPTIONS);
    session = new Session(MOCK_SESSION_OPTIONS);
  });

  test("should return an authorization token", () => {
    expect(
      getAuthorizationToken(getMockContext())({
        client,
        session,
      }),
    ).toMatchSnapshot();
  });
});
