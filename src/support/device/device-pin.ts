import { CRYPTO_PASSWORD_OPTIONS } from "../../config";
import { CryptoPassword } from "@lindorm-io/crypto";
import { Device } from "../../entity";

const crypto = new CryptoPassword(CRYPTO_PASSWORD_OPTIONS);

export const encryptDevicePIN = async (pin: string): Promise<string> => {
  return crypto.encrypt(pin);
};

export const assertDevicePIN = async (device: Device, pin: string): Promise<void> => {
  await crypto.assert(pin, device.pin.signature);
};
