import MockDate from "mockdate";
import { InvalidPermissionError, LockedAccountError } from "../error";
import { Permission, Scope } from "@lindorm-io/jwt";
import { accountMiddleware } from "./account-middleware";
import { getTestRepository, getTestAccount, logger, resetStore } from "../test";

jest.mock("uuid", () => ({
  v4: jest.fn(() => "be3a62d1-24a0-401c-96dd-3aff95356811"),
}));

MockDate.set("2020-01-01 08:00:00.000");

const next = jest.fn();

describe("accountMiddleware", () => {
  let ctx: any;

  beforeEach(async () => {
    ctx = {
      logger,
      repository: await getTestRepository(),
      token: {
        bearer: {
          subject: "be3a62d1-24a0-401c-96dd-3aff95356811",
          permission: Permission.USER,
          scope: [Scope.DEFAULT, Scope.OPENID].join(" "),
        },
      },
    };
    await ctx.repository.account.create(getTestAccount("email@lindorm.io"));
  });

  afterEach(resetStore);

  test("should successfully set account on ctx", async () => {
    await expect(accountMiddleware(ctx, next)).resolves.toBe(undefined);

    expect(ctx.account).toMatchSnapshot();
    expect(ctx.metrics.account).toStrictEqual(expect.any(Number));
  });

  test("should throw error if account is locked", async () => {
    const account = await ctx.repository.account.find({ email: "email@lindorm.io" });
    account.permission = Permission.LOCKED;
    await ctx.repository.account.update(account);

    await expect(accountMiddleware(ctx, next)).rejects.toStrictEqual(expect.any(LockedAccountError));
  });

  test("should throw error if account permission is different", async () => {
    ctx.token.bearer.permission = Permission.ADMIN;

    await expect(accountMiddleware(ctx, next)).rejects.toStrictEqual(expect.any(InvalidPermissionError));
  });
});
