import { removeAccount } from "./remove-account";
import { getTestRepository, getTestAccount, inMemoryStore, logger, resetStore } from "../../test";

jest.mock("uuid", () => ({
  v4: jest.fn(() => "be3a62d1-24a0-401c-96dd-3aff95356811"),
}));
jest.mock("../../support", () => ({
  assertAccountAdmin: jest.fn(() => () => undefined),
}));

describe("removeAccount", () => {
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

  test("should remove account", async () => {
    await expect(
      removeAccount(ctx)({
        accountId: "be3a62d1-24a0-401c-96dd-3aff95356811",
      }),
    ).resolves.toBe(undefined);
    expect(inMemoryStore).toMatchSnapshot();
  });
});
