import MockDate from "mockdate";
import { Account } from "../../entity";
import { getAccountSessions } from "./sessions";
import { getTestRepository, getTestAccount, getTestClient, getTestSession } from "../../test";

jest.mock("uuid", () => ({
  v4: jest.fn(() => "be3a62d1-24a0-401c-96dd-3aff95356811"),
}));

MockDate.set("2020-01-01 08:00:00.000");

describe("getAccountSessions", () => {
  let ctx: any;
  let account: Account;

  beforeEach(async () => {
    ctx = {
      repository: await getTestRepository(),
    };
    account = getTestAccount("email@lindorm.io");

    await ctx.repository.session.create(
      getTestSession(account, getTestClient(), "H4LnTn7e1DltMsohJgIeKSNgpvppJ1qP6QRRD9Ai1pw=", "sha256"),
    );
  });

  test("should return a list of devices", async () => {
    await expect(getAccountSessions(ctx)(account)).resolves.toMatchSnapshot();
  });
});
