import { Algorithm, KeyPair, Keystore, KeyType } from "@lindorm-io/key-pair";
import { JWT_ISSUER } from "../../../config";
import { MOCK_EC_PRIVATE_KEY, MOCK_EC_PUBLIC_KEY } from "../keys";
import { MOCK_LOGGER } from "../logger";
import { TokenIssuer } from "@lindorm-io/jwt";

export const MOCK_EC_KEY_PAIR = new KeyPair({
  algorithm: Algorithm.ES512,
  privateKey: MOCK_EC_PRIVATE_KEY,
  publicKey: MOCK_EC_PUBLIC_KEY,
  type: KeyType.EC,
});

export const MOCK_EC_KEYSTORE = new Keystore({
  keys: [MOCK_EC_KEY_PAIR],
});

export const MOCK_EC_TOKEN_ISSUER = new TokenIssuer({
  issuer: JWT_ISSUER,
  keystore: MOCK_EC_KEYSTORE,
  logger: MOCK_LOGGER,
});
