import { Account } from "../../entity";
import { getMockRepository, MOCK_ACCOUNT_OPTIONS } from "../../test/mocks";
import { getAccount } from "./get-account";
import MockDate from "mockdate";

jest.mock("uuid", () => ({
  v4: jest.fn(() => "be3a62d1-24a0-401c-96dd-3aff95356811"),
}));
jest.mock("./permission", () => ({
  assertAccountPermission: jest.fn(() => () => undefined),
}));

MockDate.set("2020-01-01 08:00:00.000");

describe("getAccount", () => {
  let getMockContext: any;

  beforeEach(() => {
    getMockContext = () => ({
      account: new Account({
        ...MOCK_ACCOUNT_OPTIONS,
        id: "id-1",
      }),
      repository: getMockRepository(),
    });
  });

  test("should return current account", async () => {
    const ctx = getMockContext();

    await expect(getAccount(ctx)("id-1")).resolves.toMatchSnapshot();

    expect(ctx.repository.account.find).not.toHaveBeenCalled();
  });

  test("should return repository account", async () => {
    const ctx = getMockContext();

    await expect(getAccount(ctx)("id-2")).resolves.toMatchSnapshot();

    expect(ctx.repository.account.find).toHaveBeenCalled();
  });
});
