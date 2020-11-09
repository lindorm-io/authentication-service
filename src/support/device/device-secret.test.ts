import { Device } from "../../entity";
import { MOCK_DEVICE_OPTIONS } from "../../test/mocks";
import { assertDeviceSecret, encryptDeviceSecret } from "./device-secret";

describe("encryptDeviceSecret", () => {
  test("should resolve", async () => {
    await expect(encryptDeviceSecret("secret")).resolves.not.toBe("secret");
  });
});

describe("assertDeviceSecret", () => {
  test("should resolve", async () => {
    const device = new Device({
      ...MOCK_DEVICE_OPTIONS,
      secret: await encryptDeviceSecret("secret"),
    });
    await expect(assertDeviceSecret(device, "secret")).resolves.toBe(undefined);
  });
});
