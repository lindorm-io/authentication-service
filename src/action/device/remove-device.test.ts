import { Account, Device } from "../../entity";
import { removeDevice } from "./remove-device";
import { getMockRepository, MOCK_DEVICE_OPTIONS, MOCK_UUID, MOCK_LOGGER, MOCK_ACCOUNT_OPTIONS } from "../../test/mocks";

jest.mock("../../support", () => ({
  assertAccountPermission: jest.fn(() => () => undefined),
  assertBearerTokenScope: jest.fn(() => () => undefined),
}));

describe("removeDevice", () => {
  let getMockContext: any;

  beforeEach(() => {
    getMockContext = () => ({
      account: new Account(MOCK_ACCOUNT_OPTIONS),
      device: new Device(MOCK_DEVICE_OPTIONS),
      logger: MOCK_LOGGER,
      repository: getMockRepository(),
    });
  });

  test("should create a device", async () => {
    const ctx = getMockContext();

    await expect(
      removeDevice(ctx)({
        deviceId: MOCK_UUID,
      }),
    ).resolves.toBe(undefined);

    expect(ctx.repository.device.remove).toHaveBeenCalled();
  });
});
