import MockDate from "mockdate";
import { addAccountOTP } from "./add-otp";
import { getTestRepository, getTestAccount, inMemoryStore, logger, resetStore } from "../../test";

jest.mock("uuid", () => ({
  v4: jest.fn(() => "be3a62d1-24a0-401c-96dd-3aff95356811"),
}));
jest.mock("../../support", () => ({
  assertBearerTokenScope: jest.fn(() => () => undefined),
  generateAccountOTP: jest.fn(() => ({ signature: "signature", uri: "uri" })),
}));

MockDate.set("2020-01-01 08:00:00.000");

describe("addAccountOTP", () => {
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

  test("should update account otp", async () => {
    await expect(addAccountOTP(ctx)()).resolves.toMatchSnapshot();
    expect(inMemoryStore).toMatchSnapshot();
  });
});
