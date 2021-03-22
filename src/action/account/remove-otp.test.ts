import MockDate from "mockdate";
import { removeAccountOTP } from "./remove-otp";
import { getTestRepository, getTestAccount, inMemoryStore, logger, resetStore } from "../../test";

jest.mock("uuid", () => ({
  v4: jest.fn(() => "be3a62d1-24a0-401c-96dd-3aff95356811"),
}));
jest.mock("../../support", () => ({
  assertAccountOTP: jest.fn(() => {}),
  assertBearerTokenScope: jest.fn(() => () => {}),
  getAccount: jest.fn(() => () => getTestAccount("email@lindorm.io")),
}));

MockDate.set("2020-01-01 08:00:00.000");

describe("removeAccountOTP", () => {
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

  test("should remove account otp", async () => {
    await expect(
      removeAccountOTP(ctx)({
        accountId: "be3a62d1-24a0-401c-96dd-3aff95356811",
        bindingCode: "123456",
      }),
    ).resolves.toBe(undefined);
    expect(inMemoryStore).toMatchSnapshot();
  });
});
