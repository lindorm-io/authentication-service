import MockDate from "mockdate";
import { Account } from "../entity";
import { InvalidPermissionError, LockedAccountError } from "../error";
import { MOCK_ACCOUNT_OPTIONS, MOCK_LOGGER, getMockRepository } from "../test/mocks";
import { Permission, Scope } from "@lindorm-io/jwt";
import { accountMiddleware } from "./account-middleware";

jest.mock("uuid", () => ({
  v4: jest.fn(() => "be3a62d1-24a0-401c-96dd-3aff95356811"),
}));

MockDate.set("2020-01-01 08:00:00.000");

describe("accountMiddleware", () => {
  let getMockContext: any;
  let next: any;

  beforeEach(() => {
    getMockContext = () => ({
      logger: MOCK_LOGGER,
      repository: getMockRepository(),
      token: {
        bearer: {
          subject: "accountId",
          permission: Permission.USER,
          scope: [Scope.DEFAULT, Scope.OPENID].join(" "),
        },
      },
    });
    next = () => Promise.resolve();
  });

  test("should successfully set account on ctx", async () => {
    const ctx = getMockContext();

    await expect(accountMiddleware(ctx, next)).resolves.toBe(undefined);

    expect(ctx.account).toMatchSnapshot();
    expect(ctx.metrics.account).toStrictEqual(expect.any(Number));
  });

  test("should throw error if account is locked", async () => {
    const context = getMockContext();
    const ctx = {
      ...context,
      repository: {
        ...context.repository,
        account: {
          ...context.repository.account,
          find: jest.fn(
            () =>
              new Account({
                ...MOCK_ACCOUNT_OPTIONS,
                permission: Permission.LOCKED,
              }),
          ),
        },
      },
    };

    await expect(accountMiddleware(ctx, next)).rejects.toStrictEqual(expect.any(LockedAccountError));
  });

  test("should throw error if account permission is different", async () => {
    const context = getMockContext();
    const ctx = {
      ...context,
      token: {
        ...context.token,
        bearer: {
          ...context.token.bearer,
          permission: Permission.ADMIN,
        },
      },
    };

    await expect(accountMiddleware(ctx, next)).rejects.toStrictEqual(expect.any(InvalidPermissionError));
  });
});
