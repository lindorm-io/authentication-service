import { CRYPTO_PASSWORD_OPTIONS } from "../../config";
import { CryptoPassword } from "@lindorm-io/crypto";
import { Device } from "../../entity";

const crypto = new CryptoPassword(CRYPTO_PASSWORD_OPTIONS);

export const encryptDeviceSecret = async (secret: string): Promise<string> => {
  return crypto.encrypt(secret);
};

export const assertDeviceSecret = async (device: Device, secret: string): Promise<void> => {
  await crypto.assert(secret, device.secret);
};
