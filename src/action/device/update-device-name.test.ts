import MockDate from "mockdate";
import { Account, Device } from "../../entity";
import { updateDeviceName } from "./update-device-name";
import { getMockRepository, MOCK_DEVICE_OPTIONS, MOCK_LOGGER, MOCK_UUID, MOCK_ACCOUNT_OPTIONS } from "../../test/mocks";

jest.mock("uuid", () => ({
  v4: jest.fn(() => "be3a62d1-24a0-401c-96dd-3aff95356811"),
}));
jest.mock("../../support", () => ({
  assertAccountPermission: jest.fn(() => () => undefined),
  assertBearerTokenScope: jest.fn(() => () => undefined),
}));

MockDate.set("2020-01-01 08:00:00.000");
const date = new Date("2020-01-01 08:00:00.000");

describe("updateDeviceName", () => {
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
      updateDeviceName(ctx)({
        deviceId: MOCK_UUID,
        name: "name",
      }),
    ).resolves.toBe(undefined);

    expect(ctx.repository.device.update).toHaveBeenCalledWith({
      _accountId: "accountId",
      _created: date,
      _events: [
        {
          created: date,
          name: "device_name_changed",
          payload: {
            name: "name",
          },
        },
      ],
      _id: MOCK_UUID,
      _name: "name",
      _pin: { signature: null, updated: null },
      _publicKey: expect.any(String),
      _secret: null,
      _updated: date,
      _version: 0,
    });
  });
});
