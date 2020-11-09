import MockDate from "mockdate";
import { RepositoryEntityNotFoundError } from "@lindorm-io/mongo";
import { findOrCreateAccount } from "./find-or-create-account";
import { getMockRepository } from "../../test/mocks";

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

  test("should return an existing account", async () => {
    await expect(findOrCreateAccount(getMockContext())("existing")).resolves.toMatchSnapshot();
  });

  test("should create a new account", async () => {
    const context = getMockContext();
    const ctx = {
      ...context,
      repository: {
        ...context.repository,
        account: {
          ...context.repository.account,
          find: jest.fn(() => {
            throw new RepositoryEntityNotFoundError({}, {});
          }),
        },
      },
    };

    await expect(findOrCreateAccount(ctx)("created")).resolves.toMatchSnapshot();
  });

  test("should reject with error", async () => {
    const context = getMockContext();
    const ctx = {
      ...context,
      repository: {
        ...context.repository,
        account: {
          ...context.repository.account,
          find: jest.fn(() => {
            throw new Error("error");
          }),
        },
      },
    };

    await expect(findOrCreateAccount(ctx)("reject")).rejects.toStrictEqual(expect.any(Error));
  });
});
