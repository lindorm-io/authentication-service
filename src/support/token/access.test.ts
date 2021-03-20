import MockDate from "mockdate";
import { Account } from "../../entity";
import { Client } from "@lindorm-io/koa-client";
import { MOCK_ACCOUNT_OPTIONS, MOCK_CLIENT_OPTIONS, MOCK_EC_TOKEN_ISSUER } from "../../test/mocks";
import { getAccessToken } from "./access";
import { winston } from "../../logger";

jest.mock("jsonwebtoken", () => ({
  sign: (data: any) => data,
}));
jest.mock("uuid", () => ({
  v4: jest.fn(() => "be3a62d1-24a0-401c-96dd-3aff95356811"),
}));

MockDate.set("2020-01-01 08:00:00.000");

describe("getAccessToken", () => {
  let getMockContext: any;

  let account: Account;
  let client: Client;

  beforeEach(() => {
    getMockContext = () => ({
      logger: winston,
      issuer: { tokenIssuer: MOCK_EC_TOKEN_ISSUER },
      metadata: { deviceId: "deviceId" },
    });

    account = new Account(MOCK_ACCOUNT_OPTIONS);
    client = new Client(MOCK_CLIENT_OPTIONS);
  });

  test("should return an access token", () => {
    expect(
      getAccessToken(getMockContext())({
        account,
        authMethodsReference: "authMethodsReference",
        client,
        scope: "scope",
      }),
    ).toMatchSnapshot();
  });
});
