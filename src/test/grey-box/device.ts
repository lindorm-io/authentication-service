import { Account, Device } from "../../entity";
import { encryptDevicePIN, encryptDeviceSecret } from "../../support/device";
import { getKeyPairRSA } from "./key-pair";

export const getGreyBoxDevice = async (account: Account): Promise<Device> =>
  new Device({
    accountId: account.id,
    publicKey: getKeyPairRSA().publicKey,
    pin: {
      signature: await encryptDevicePIN("123456"),
      updated: new Date(),
    },
    secret: await encryptDeviceSecret("test_device_secret"),
  });
