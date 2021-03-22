import MockDate from "mockdate";
import { getAccountInformation } from "./get-account-information";
import { getTestAccount, logger } from "../../test";

jest.mock("uuid", () => ({
  v4: jest.fn(() => "be3a62d1-24a0-401c-96dd-3aff95356811"),
}));
jest.mock("../../support", () => ({
  getAccount: jest.fn(() => () => getTestAccount("email@lindorm.io")),
  getAccountDevices: jest.fn(() => () => ["devices"]),
  getAccountSessions: jest.fn(() => () => ["sessions"]),
}));

MockDate.set("2020-01-01 08:00:00.000");

describe("getAccountInformation", () => {
  let ctx: any;

  beforeEach(() => {
    ctx = {
      logger,
    };
  });

  test("should return account information", async () => {
    await expect(
      getAccountInformation(ctx)({
        accountId: "be3a62d1-24a0-401c-96dd-3aff95356811",
      }),
    ).resolves.toMatchSnapshot();
  });
});
