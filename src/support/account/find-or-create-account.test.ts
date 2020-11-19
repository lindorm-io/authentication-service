import MockDate from "mockdate";
import { Account } from "../../entity";
import { InvalidPermissionError } from "../../error";
import { Permission } from "@lindorm-io/jwt";
import { findOrCreateAccount } from "./find-or-create-account";
import { getMockRepository, MOCK_ACCOUNT_OPTIONS } from "../../test/mocks";

jest.mock("uuid", () => ({
  v4: jest.fn(() => "be3a62d1-24a0-401c-96dd-3aff95356811"),
}));

MockDate.set("2020-01-01 08:00:00.000");

describe("findOrCreateAccount", () => {
  let getMockContext: any;

  beforeEach(() => {
    getMockContext = () => ({
      repository: getMockRepository(),
    });
  });

  test("should return an account", async () => {
    await expect(findOrCreateAccount(getMockContext())("existing")).resolves.toMatchSnapshot();
  });

  test("should throw error when account is locked", async () => {
    const context = getMockContext();
    const ctx = {
      ...context,
      repository: {
        ...context.repository,
        account: {
          ...context.repository.account,
          findOrCreate: jest.fn(() => new Account({ ...MOCK_ACCOUNT_OPTIONS, permission: Permission.LOCKED })),
        },
      },
    };

    await expect(findOrCreateAccount(ctx)("reject")).rejects.toStrictEqual(expect.any(InvalidPermissionError));
  });
});
