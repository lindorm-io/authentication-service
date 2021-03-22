import MockDate from "mockdate";
import { Permission } from "@lindorm-io/jwt";
import { getTestRepository, getTestAccount, inMemoryStore, logger, resetStore } from "../../test";
import { updateAccountPermission } from "./update-permission";

jest.mock("uuid", () => ({
  v4: jest.fn(() => "be3a62d1-24a0-401c-96dd-3aff95356811"),
}));
jest.mock("../../support", () => ({
  assertAccountAdmin: jest.fn(() => () => {}),
}));

MockDate.set("2020-01-01 08:00:00.000");

describe("updateAccountPermission", () => {
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

  test("should update account permission", async () => {
    await expect(
      updateAccountPermission(ctx)({
        accountId: "be3a62d1-24a0-401c-96dd-3aff95356811",
        permission: Permission.LOCKED,
      }),
    ).resolves.toBe(undefined);
    expect(inMemoryStore).toMatchSnapshot();
  });
});
