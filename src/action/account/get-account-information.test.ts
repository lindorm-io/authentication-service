import MockDate from "mockdate";
import { Account } from "../../entity";
import { MOCK_ACCOUNT_OPTIONS, MOCK_UUID } from "../../test/mocks";
import { getAccountInformation } from "./get-account-information";
import { winston } from "../../logger";

jest.mock("uuid", () => ({
  v4: jest.fn(() => "be3a62d1-24a0-401c-96dd-3aff95356811"),
}));
jest.mock("../../support", () => ({
  getAccount: jest.fn(() => () => new Account(MOCK_ACCOUNT_OPTIONS)),
  getAccountDevices: jest.fn(() => () => ["devices"]),
  getAccountSessions: jest.fn(() => () => ["sessions"]),
}));

MockDate.set("2020-01-01 08:00:00.000");

describe("getAccountInformation", () => {
  let getMockContext: any;

  beforeEach(() => {
    getMockContext = () => ({
      logger: winston,
    });
  });

  test("should return account information", async () => {
    await expect(
      getAccountInformation(getMockContext())({
        accountId: MOCK_UUID,
      }),
    ).resolves.toMatchSnapshot();
  });
});
