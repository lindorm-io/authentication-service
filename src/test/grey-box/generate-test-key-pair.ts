import { KeyPair, KeyType } from "@lindorm-io/key-pair";
import { generateKeys } from "../../support";

export const generateTestKeyPair = async (): Promise<KeyPair> => {
  const data = await generateKeys(KeyType.EC);
  return new KeyPair(data);
};
