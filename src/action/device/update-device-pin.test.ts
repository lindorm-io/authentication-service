import MockDate from "mockdate";
import { Account } from "../../entity";
import { updateDevicePIN } from "./update-device-pin";
import { getMockRepository, MOCK_LOGGER, MOCK_UUID, MOCK_ACCOUNT_OPTIONS } from "../../test/mocks";

jest.mock("uuid", () => ({
  v4: jest.fn(() => "be3a62d1-24a0-401c-96dd-3aff95356811"),
}));
jest.mock("../../support", () => ({
  assertAccountPermission: jest.fn(() => () => undefined),
  assertBearerTokenScope: jest.fn(() => () => undefined),
  assertDevicePIN: jest.fn(() => undefined),
  encryptDevicePIN: jest.fn(() => "encryptDevicePin"),
}));

MockDate.set("2020-01-01 08:00:00.000");
const date = new Date("2020-01-01 08:00:00.000");

describe("updateDevicePIN", () => {
  let getMockContext: any;

  beforeEach(() => {
    getMockContext = () => ({
      account: new Account(MOCK_ACCOUNT_OPTIONS),
      logger: MOCK_LOGGER,
      repository: getMockRepository(),
    });
  });

  test("should create a device", async () => {
    const ctx = getMockContext();

    await expect(
      updateDevicePIN(ctx)({
        deviceId: MOCK_UUID,
        pin: "123456",
        updatedPin: "345678",
      }),
    ).resolves.toBe(undefined);

    expect(ctx.repository.device.update).toHaveBeenCalledWith({
      _accountId: "accountId",
      _created: date,
      _events: [
        {
          created: date,
          name: "device_pin_changed",
          payload: {
            pin: {
              signature: "encryptDevicePin",
              updated: date,
            },
          },
        },
      ],
      _id: MOCK_UUID,
      _name: null,
      _pin: {
        signature: "encryptDevicePin",
        updated: date,
      },
      _publicKey: expect.any(String),
      _secret: null,
      _updated: date,
      _version: 0,
    });
  });
});
