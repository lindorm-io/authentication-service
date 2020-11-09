import MockDate from "mockdate";
import { InvalidDeviceError } from "../error";
import { MOCK_LOGGER, MOCK_UUID, getMockRepository } from "../test/mocks";
import { deviceMiddleware } from "./device-middleware";

jest.mock("uuid", () => ({
  v4: jest.fn(() => "be3a62d1-24a0-401c-96dd-3aff95356811"),
}));

MockDate.set("2020-01-01 08:00:00.000");

describe("deviceMiddleware", () => {
  let getMockContext: any;
  let next: any;

  beforeEach(() => {
    getMockContext = () => ({
      logger: MOCK_LOGGER,
      repository: getMockRepository(),
      request: { body: { deviceId: MOCK_UUID } },
    });
    next = () => Promise.resolve();
  });

  test("should successfully set device on ctx", async () => {
    const ctx = getMockContext();

    await expect(deviceMiddleware({ throwError: true })(ctx, next)).resolves.toBe(undefined);

    expect(ctx.device).toMatchSnapshot();
    expect(ctx.metrics.device).toStrictEqual(expect.any(Number));
  });

  test("should skip setting device when there is no device id", async () => {
    const context = getMockContext();
    const ctx = {
      ...context,
      repository: {
        ...context.repository,
        device: {
          ...context.repository.device,
          find: jest.fn(() => {
            throw new Error();
          }),
        },
      },
    };

    await expect(deviceMiddleware({ throwError: false })(ctx, next)).resolves.toBe(undefined);

    expect(ctx.device).toBe(undefined);
  });

  test("should throw error on missing device", async () => {
    const context = getMockContext();
    const ctx = {
      ...context,
      repository: {
        ...context.repository,
        device: {
          ...context.repository.device,
          find: jest.fn(() => {
            throw new Error();
          }),
        },
      },
    };

    await expect(deviceMiddleware({ throwError: true })(ctx, next)).rejects.toStrictEqual(
      expect.any(InvalidDeviceError),
    );
  });
});
