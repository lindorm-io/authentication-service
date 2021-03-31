import { Account } from "../../entity";
import { config } from "../../config";
import { CryptoPassword } from "@lindorm-io/crypto";

const crypto = new CryptoPassword({
  aesSecret: config.CRYPTO_AES_SECRET,
  shaSecret: config.CRYPTO_SHA_SECRET,
});

export const encryptAccountPassword = async (password: string): Promise<string> => {
  return crypto.encrypt(password);
};

export const assertAccountPassword = async (account: Account, password: string): Promise<void> => {
  await crypto.assert(password, account.password.signature);
};
