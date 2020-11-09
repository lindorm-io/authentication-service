import { getMockRepository, MOCK_UUID } from "../../test/mocks";
import { logoutWithId } from "./logout-with-id";

jest.mock("../../support", () => ({
  assertAccountPermission: jest.fn(() => () => undefined),
}));

describe("logoutWithId", () => {
  let getMockContext: any;

  beforeEach(() => {
    getMockContext = () => ({
      repository: getMockRepository(),
    });
  });

  test("should log out", async () => {
    const ctx = getMockContext();

    await expect(logoutWithId(ctx)({ sessionId: MOCK_UUID })).resolves.toBe(undefined);

    expect(ctx.repository.session.remove).toHaveBeenCalled();
  });
});
