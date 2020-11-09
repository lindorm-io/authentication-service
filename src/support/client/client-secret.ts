import { CRYPTO_SECRET_OPTIONS } from "../../config";
import { Client } from "../../entity";
import { CryptoSecret } from "@lindorm-io/crypto";

const crypto = new CryptoSecret(CRYPTO_SECRET_OPTIONS);

export const encryptClientSecret = (secret: string): string => {
  return crypto.encrypt(secret);
};

export const assertClientSecret = (client: Client, secret: string): void => {
  crypto.assert(secret, client.secret);
};
