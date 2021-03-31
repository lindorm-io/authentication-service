import { config } from "../../config";
import { CryptoSecret } from "@lindorm-io/crypto";

const crypto = new CryptoSecret({
  aesSecret: config.CRYPTO_AES_SECRET,
  shaSecret: config.CRYPTO_SHA_SECRET,
});

export const encryptClientSecret = (secret: string): string => {
  return crypto.encrypt(secret);
};
