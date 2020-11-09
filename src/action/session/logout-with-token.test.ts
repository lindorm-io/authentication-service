import { getMockRepository } from "../../test/mocks";
import { logoutWithToken } from "./logout-with-token";

jest.mock("../../support", () => ({
  assertAccountPermission: jest.fn(() => () => undefined),
}));

describe("logoutWithToken", () => {
  let getMockContext: any;

  beforeEach(() => {
    getMockContext = () => ({
      repository: getMockRepository(),
      token: { refresh: { subject: "sessionId" } },
    });
  });

  test("should log out", async () => {
    const ctx = getMockContext();

    await expect(logoutWithToken(ctx)({ refreshToken: "token.token.token" })).resolves.toBe(undefined);

    expect(ctx.repository.session.remove).toHaveBeenCalled();
  });
});
