import { Account, Device } from "../../entity";
import { encryptDevicePIN, encryptDeviceSecret } from "../../support";
import { generateRSAKeys, KeyPairHandler } from "@lindorm-io/key-pair";
import { getRandomNumber, getRandomValue } from "@lindorm-io/core";

export interface IGenerateTestDeviceData {
  device: Device;
  id: string;
  handler: KeyPairHandler;
  pin: string;
  secret: string;
}

export const generateTestDevice = async (account: Account): Promise<IGenerateTestDeviceData> => {
  const data = await generateRSAKeys("");
  const handler = new KeyPairHandler(data);

  const pin = await getRandomNumber(6);
  const secret = getRandomValue(32);

  const device = new Device({
    accountId: account.id,
    publicKey: data.publicKey,
    pin: {
      signature: await encryptDevicePIN(pin),
      updated: new Date(),
    },
    secret: await encryptDeviceSecret(secret),
  });

  return {
    device,
    id: device.id,
    handler,
    pin,
    secret,
  };
};
