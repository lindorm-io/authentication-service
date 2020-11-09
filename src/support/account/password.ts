import { Account } from "../../entity";
import { CRYPTO_PASSWORD_OPTIONS } from "../../config";
import { CryptoPassword } from "@lindorm-io/crypto";

const crypto = new CryptoPassword(CRYPTO_PASSWORD_OPTIONS);

export const encryptAccountPassword = async (password: string): Promise<string> => {
  return crypto.encrypt(password);
};

export const assertAccountPassword = async (account: Account, password: string): Promise<void> => {
  await crypto.assert(password, account.password.signature);
};
