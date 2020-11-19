import MockDate from "mockdate";
import { Account } from "../../entity";
import { getMockRepository, MOCK_LOGGER, MOCK_UUID, MOCK_ACCOUNT_OPTIONS } from "../../test/mocks";
import { updateDeviceSecret } from "./update-device-secret";

jest.mock("uuid", () => ({
  v4: jest.fn(() => "be3a62d1-24a0-401c-96dd-3aff95356811"),
}));
jest.mock("../../support", () => ({
  assertAccountPermission: jest.fn(() => () => undefined),
  assertBearerTokenScope: jest.fn(() => () => undefined),
  assertDevicePIN: jest.fn(() => undefined),
  encryptDeviceSecret: jest.fn(() => "encryptDeviceSecret"),
}));

MockDate.set("2020-01-01 08:00:00.000");
const date = new Date("2020-01-01 08:00:00.000");

describe("updateDeviceSecret", () => {
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
      updateDeviceSecret(ctx)({
        deviceId: MOCK_UUID,
        pin: "123456",
        updatedSecret: "secret",
      }),
    ).resolves.toBe(undefined);

    expect(ctx.repository.device.update).toHaveBeenCalledWith({
      _accountId: "accountId",
      _created: date,
      _events: [
        {
          date: date,
          name: "device_secret_changed",
          payload: {
            secret: "encryptDeviceSecret",
          },
        },
      ],
      _id: "be3a62d1-24a0-401c-96dd-3aff95356811",
      _name: null,
      _pin: {
        signature: null,
        updated: null,
      },
      _publicKey: expect.any(String),
      _secret: "encryptDeviceSecret",
      _updated: date,
      _version: 0,
    });
  });
});
