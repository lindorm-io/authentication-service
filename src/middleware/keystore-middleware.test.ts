import MockDate from "mockdate";
import { MOCK_LOGGER, getMockRepository } from "../test/mocks";
import { keystoreMiddleware } from "./keystore-middleware";

jest.mock("uuid", () => ({
  v4: jest.fn(() => "be3a62d1-24a0-401c-96dd-3aff95356811"),
}));

MockDate.set("2020-01-01 08:00:00.000");

describe("keystoreMiddleware", () => {
  let getMockContext: any;
  let next: any;

  beforeEach(() => {
    getMockContext = () => ({
      logger: MOCK_LOGGER,
      repository: getMockRepository(),
    });

    next = () => Promise.resolve();
  });

  test("should successfully set keystore on ctx", async () => {
    const ctx = getMockContext();

    await expect(keystoreMiddleware(ctx, next)).resolves.toBe(undefined);

    expect(ctx.keystore).toMatchSnapshot();
  });
});
