import MockDate from "mockdate";
import { Account } from "../../entity";
import { InvalidPermissionError } from "../../error";
import { Permission } from "@lindorm-io/jwt";
import { requestEnsureIdentity } from "../../axios";
import { findOrCreateAccount } from "./find-or-create-account";
import { getTestRepository, resetStore } from "../../test";

jest.mock("uuid", () => ({
  v4: jest.fn(() => "be3a62d1-24a0-401c-96dd-3aff95356811"),
}));
jest.mock("../../axios", () => ({
  requestEnsureIdentity: jest.fn(() => () => ({})),
}));

MockDate.set("2020-01-01 08:00:00.000");

describe("findOrCreateAccount", () => {
  let ctx: any;
  let account: Account;

  beforeEach(async () => {
    ctx = {
      repository: await getTestRepository(),
    };
    account = await ctx.repository.account.create(
      new Account({
        email: "test@lindorm.io",
      }),
    );
  });

  afterEach(() => {
    jest.clearAllMocks();
    resetStore();
  });

  test("should return an account", async () => {
    await expect(findOrCreateAccount(ctx)(account.email)).resolves.toMatchSnapshot();
    expect(requestEnsureIdentity).toHaveBeenCalled();
  });

  test("should not ensure identity if id already exists", async () => {
    account.identityLinked = true;
    await ctx.repository.account.update(account);

    await expect(findOrCreateAccount(ctx)(account.email)).resolves.toMatchSnapshot();
    expect(requestEnsureIdentity).not.toHaveBeenCalled();
  });

  test("should throw error when account is locked", async () => {
    account.permission = Permission.LOCKED;

    await ctx.repository.account.update(account);
    await expect(findOrCreateAccount(ctx)(account.email)).rejects.toStrictEqual(expect.any(InvalidPermissionError));
  });
});
