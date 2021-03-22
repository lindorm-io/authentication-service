import MockDate from "mockdate";
import { baseHash } from "@lindorm-io/core";
import { getTestRepository, getTestAccount, inMemoryStore, logger, resetStore } from "../../test";
import { updateAccountPassword } from "./update-password";

jest.mock("uuid", () => ({
  v4: jest.fn(() => "be3a62d1-24a0-401c-96dd-3aff95356811"),
}));
jest.mock("../../support", () => ({
  assertAccountPassword: jest.fn(() => {}),
  assertBearerTokenScope: jest.fn(() => () => {}),
  encryptAccountPassword: jest.fn((input) => baseHash(input)),
}));

MockDate.set("2020-01-01 08:00:00.000");

describe("updateAccountPassword", () => {
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

  test("should update account password", async () => {
    await expect(
      updateAccountPassword(ctx)({
        password: "password",
        updatedPassword: "updatedPassword",
      }),
    ).resolves.toBe(undefined);
    expect(inMemoryStore).toMatchSnapshot();
  });
});
