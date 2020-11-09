import MockDate from "mockdate";
import { Account, Client, Device } from "../../entity";
import { getIdentityToken } from "./identity";
import {
  MOCK_ACCOUNT_OPTIONS,
  MOCK_CLIENT_OPTIONS,
  MOCK_DEVICE_OPTIONS,
  MOCK_EC_TOKEN_ISSUER,
  MOCK_LOGGER,
} from "../../test/mocks";

jest.mock("uuid", () => ({
  v4: jest.fn(() => "be3a62d1-24a0-401c-96dd-3aff95356811"),
}));

MockDate.set("2020-01-01 08:00:00.000");

describe("getIdentityToken", () => {
  let getMockContext: any;

  let account: Account;
  let client: Client;
  let device: Device;

  beforeEach(() => {
    getMockContext = () => ({
      logger: MOCK_LOGGER,
      issuer: { tokenIssuer: MOCK_EC_TOKEN_ISSUER },
    });

    account = new Account(MOCK_ACCOUNT_OPTIONS);
    client = new Client(MOCK_CLIENT_OPTIONS);
    device = new Device(MOCK_DEVICE_OPTIONS);
  });

  test("should return an identity token", () => {
    expect(
      getIdentityToken(getMockContext())({
        account,
        client,
        device,
        payload: { data: true },
      }),
    ).toStrictEqual({
      expires: 1577948400,
      expiresIn: 86400,
      id: "be3a62d1-24a0-401c-96dd-3aff95356811",
      level: undefined,
      token: expect.any(String),
    });
  });

  test("should return an identity token without device", () => {
    expect(
      getIdentityToken(getMockContext())({
        account,
        client,
        payload: { data: true },
      }),
    ).toStrictEqual({
      expires: 1577948400,
      expiresIn: 86400,
      id: "be3a62d1-24a0-401c-96dd-3aff95356811",
      level: undefined,
      token: expect.any(String),
    });
  });
});
