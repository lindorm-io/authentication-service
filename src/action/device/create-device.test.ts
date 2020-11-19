import MockDate from "mockdate";
import { Account } from "../../entity";
import { MOCK_LOGGER } from "../../test/mocks";
import { createDevice } from "./create-device";
import { getMockRepository, MOCK_ACCOUNT_OPTIONS } from "../../test/mocks";

jest.mock("uuid", () => ({
  v4: jest.fn(() => "be3a62d1-24a0-401c-96dd-3aff95356811"),
}));
jest.mock("../../support", () => ({
  assertAccountPermission: jest.fn(() => () => undefined),
  assertBearerTokenScope: jest.fn(() => () => undefined),
  encryptDevicePIN: jest.fn(() => "encryptDevicePIN"),
  encryptDeviceSecret: jest.fn(() => "encryptDeviceSecret"),
}));

MockDate.set("2020-01-01 08:00:00.000");
const date = new Date("2020-01-01 08:00:00.000");

describe("createDevice", () => {
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
      createDevice(ctx)({
        name: "name",
        pin: "123456",
        publicKey: "publicKey",
        secret: "secret",
      }),
    ).resolves.toStrictEqual({
      deviceId: "be3a62d1-24a0-401c-96dd-3aff95356811",
    });

    expect(ctx.repository.device.create).toHaveBeenCalledWith({
      _accountId: "be3a62d1-24a0-401c-96dd-3aff95356811",
      _created: date,
      _events: [],
      _id: "be3a62d1-24a0-401c-96dd-3aff95356811",
      _name: "name",
      _pin: { signature: "encryptDevicePIN", updated: date },
      _publicKey: "publicKey",
      _secret: "encryptDeviceSecret",
      _updated: date,
      _version: 0,
    });
  });
});
