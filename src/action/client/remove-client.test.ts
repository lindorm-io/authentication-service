import { Account } from "../../entity";
import { getMockCache, MOCK_LOGGER, MOCK_UUID, getMockRepository, MOCK_ACCOUNT_OPTIONS } from "../../test/mocks";
import { removeClient } from "./remove-client";

jest.mock("uuid", () => ({
  v4: jest.fn(() => "be3a62d1-24a0-401c-96dd-3aff95356811"),
}));
jest.mock("../../support", () => ({
  assertAccountAdmin: jest.fn(() => () => undefined),
}));

describe("removeClient", () => {
  let getMockContext: any;

  beforeEach(() => {
    getMockContext = () => ({
      account: new Account(MOCK_ACCOUNT_OPTIONS),
      cache: getMockCache(),
      logger: MOCK_LOGGER,
      repository: getMockRepository(),
    });
  });

  test("should remove client", async () => {
    const ctx = getMockContext();

    await expect(removeClient(ctx)({ clientId: MOCK_UUID })).resolves.toBe(undefined);

    expect(ctx.repository.client.remove).toHaveBeenCalled();
    expect(ctx.cache.client.remove).toHaveBeenCalled();
  });
});
