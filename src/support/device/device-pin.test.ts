import { Device } from "../../entity";
import { MOCK_DEVICE_OPTIONS } from "../../test/mocks";
import { assertDevicePIN, encryptDevicePIN } from "./device-pin";

describe("encryptDevicePIN", () => {
  test("should resolve", async () => {
    await expect(encryptDevicePIN("secret")).resolves.not.toBe("secret");
  });
});

describe("assertDevicePIN", () => {
  test("should resolve", async () => {
    const device = new Device({
      ...MOCK_DEVICE_OPTIONS,
      pin: {
        signature: await encryptDevicePIN("secret"),
        updated: new Date(),
      },
    });
    await expect(assertDevicePIN(device, "secret")).resolves.toBe(undefined);
  });
});
