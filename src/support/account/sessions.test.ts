import MockDate from "mockdate";
import { Account } from "../../entity";
import { MOCK_ACCOUNT_OPTIONS, getMockRepository } from "../../test/mocks";
import { getAccountSessions } from "./sessions";

jest.mock("uuid", () => ({
  v4: jest.fn(() => "be3a62d1-24a0-401c-96dd-3aff95356811"),
}));

MockDate.set("2020-01-01 08:00:00.000");

describe("getAccountSessions", () => {
  let getMockContext: any;

  beforeEach(() => {
    getMockContext = () => ({
      account: new Account(MOCK_ACCOUNT_OPTIONS),
      repository: getMockRepository(),
    });
  });

  test("should return a list of devices", async () => {
    await expect(getAccountSessions(getMockContext())(new Account(MOCK_ACCOUNT_OPTIONS))).resolves.toMatchSnapshot();
  });
});
