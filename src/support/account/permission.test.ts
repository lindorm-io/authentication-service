import MockDate from "mockdate";
import { Account } from "../../entity";
import { AccountNotFoundError, InvalidPermissionError } from "../../error";
import { MOCK_ACCOUNT_OPTIONS } from "../../test/mocks";
import { Permission } from "@lindorm-io/jwt";
import { assertAccountAdmin, assertAccountPermission } from "./permission";

jest.mock("uuid", () => ({
  v4: jest.fn(() => "be3a62d1-24a0-401c-96dd-3aff95356811"),
}));

MockDate.set("2020-01-01 08:00:00.000");

describe("assertAccountPermission", () => {
  let getMockContext: any;

  beforeEach(() => {
    getMockContext = () => ({
      account: new Account(MOCK_ACCOUNT_OPTIONS),
    });
  });

  test("should successfully assert permissions as user", () => {
    const ctx = getMockContext();
    ctx.account.permission = Permission.USER;

    expect(assertAccountPermission(ctx)("be3a62d1-24a0-401c-96dd-3aff95356811")).toBe(undefined);
  });

  test("should successfully assert permissions as admin", () => {
    const ctx = getMockContext();
    ctx.account.permission = Permission.ADMIN;

    expect(assertAccountPermission(ctx)("another-uuid")).toBe(undefined);
  });

  test("should throw error if account is missing", () => {
    // @ts-ignore
    expect(() => assertAccountPermission({})("be3a62d1-24a0-401c-96dd-3aff95356811")).toThrow(
      expect.any(AccountNotFoundError),
    );
  });

  test("should throw error if user is trying to assert another user", () => {
    const ctx = getMockContext();
    ctx.account.permission = Permission.USER;

    expect(() => assertAccountPermission(ctx)("wrong-uuid")).toThrow(expect.any(InvalidPermissionError));
  });
});

describe("assertAccountAdmin", () => {
  let getMockContext: any;

  beforeEach(() => {
    getMockContext = () => ({
      account: new Account(MOCK_ACCOUNT_OPTIONS),
    });
  });

  test("should successfully assert permissions as admin", () => {
    const ctx = getMockContext();
    ctx.account.permission = Permission.ADMIN;

    expect(assertAccountAdmin(ctx)()).toBe(undefined);
  });

  test("should throw error if account is missing", () => {
    // @ts-ignore
    expect(() => assertAccountAdmin({})()).toThrow(expect.any(AccountNotFoundError));
  });

  test("should throw error if user is not admin", () => {
    const ctx = getMockContext();
    ctx.account.permission = Permission.USER;

    expect(() => assertAccountAdmin(ctx)()).toThrow(expect.any(InvalidPermissionError));
  });
});
