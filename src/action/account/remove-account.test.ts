import { Account } from "../../entity";
import { MOCK_LOGGER, MOCK_UUID } from "../../test/mocks";
import { getMockRepository, MOCK_ACCOUNT_OPTIONS } from "../../test/mocks";
import { removeAccount } from "./remove-account";

jest.mock("uuid", () => ({
  v4: jest.fn(() => "be3a62d1-24a0-401c-96dd-3aff95356811"),
}));
jest.mock("../../support", () => ({
  assertAccountAdmin: jest.fn(() => () => undefined),
}));

describe("removeAccount", () => {
  let getMockContext: any;

  beforeEach(() => {
    getMockContext = () => ({
      account: new Account(MOCK_ACCOUNT_OPTIONS),
      logger: MOCK_LOGGER,
      repository: getMockRepository(),
    });
  });

  test("should remove account", async () => {
    const ctx = getMockContext();

    await expect(
      removeAccount(ctx)({
        accountId: MOCK_UUID,
      }),
    ).resolves.toBe(undefined);

    expect(ctx.repository.account.remove).toHaveBeenCalled();
  });
});
