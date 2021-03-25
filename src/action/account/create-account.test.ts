import MockDate from "mockdate";
import { Permission } from "@lindorm-io/jwt";
import { createAccount } from "./create-account";
import { getTestRepository, getTestAccount, inMemoryStore, logger, resetStore } from "../../test";

jest.mock("uuid", () => ({
  v4: jest.fn(() => "be3a62d1-24a0-401c-96dd-3aff95356811"),
}));
jest.mock("../../axios", () => ({
  requestEnsureIdentity: jest.fn(() => ({})),
}));
jest.mock("../../support", () => ({
  assertAccountAdmin: jest.fn(() => () => {}),
}));

MockDate.set("2020-01-01 08:00:00.000");

describe("createAccount", () => {
  let ctx: any;

  beforeEach(async () => {
    ctx = {
      account: getTestAccount("email@lindorm.io"),
      logger,
      repository: await getTestRepository(),
    };
    await ctx.repository.account.create(ctx.account);
  });

  afterEach(resetStore);

  test("should create account", async () => {
    await expect(
      createAccount(ctx)({
        email: "lindorm@lindorm.io",
        permission: Permission.LOCKED,
      }),
    ).resolves.toMatchSnapshot();
    expect(inMemoryStore).toMatchSnapshot();
  });
});
