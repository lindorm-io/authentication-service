import {
  IGenerateECCKeysData,
  IGenerateRSAKeysData,
  KeyPair,
  KeyType,
  generateECCKeys,
  generateRSAKeys,
} from "@lindorm-io/key-pair";

export const generateKeys = async (type: KeyType): Promise<IGenerateECCKeysData | IGenerateRSAKeysData> => {
  switch (type) {
    case KeyType.EC:
      return generateECCKeys();

    case KeyType.RSA:
      return generateRSAKeys();

    default:
      throw new Error(`Wrong key pair type: ${type}`);
  }
};

export const generateKeyPair = async (type: KeyType): Promise<KeyPair> => {
  const keyData = await generateKeys(type);
  const keyPair = new KeyPair(keyData);
  keyPair.create();

  return keyPair;
};
