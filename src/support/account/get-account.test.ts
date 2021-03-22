import { Account } from "../../entity";
import { getAccount } from "./get-account";
import MockDate from "mockdate";
import { getTestRepository, getTestAccount } from "../../test";

jest.mock("uuid", () => ({
  v4: jest.fn(() => "be3a62d1-24a0-401c-96dd-3aff95356811"),
}));
jest.mock("./permission", () => ({
  assertAccountPermission: jest.fn(() => () => undefined),
}));

MockDate.set("2020-01-01 08:00:00.000");

describe("getAccount", () => {
  let ctx: any;

  beforeEach(async () => {
    ctx = {
      account: getTestAccount("email@lindorm.io"),
      repository: await getTestRepository(),
    };
    await ctx.repository.account.create(ctx.account);
  });

  test("should return current account", async () => {
    await expect(getAccount(ctx)("be3a62d1-24a0-401c-96dd-3aff95356811")).resolves.toMatchSnapshot();
  });

  test("should return repository account", async () => {
    await ctx.repository.account.create(
      new Account({
        id: "e1364c08-f2f3-41f7-b4a4-108928c3d1bb",
        email: "other@lindorm.io",
      }),
    );

    await expect(getAccount(ctx)("e1364c08-f2f3-41f7-b4a4-108928c3d1bb")).resolves.toMatchSnapshot();
  });
});
