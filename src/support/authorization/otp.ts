import { Authorization } from "../../entity";
import { config } from "../../config";
import { CryptoSecret } from "@lindorm-io/crypto";

const cryptoSecret = new CryptoSecret({
  aesSecret: config.CRYPTO_AES_SECRET,
  shaSecret: config.CRYPTO_SHA_SECRET,
});

export const encryptAuthorizationOTP = (code: string): string => {
  return cryptoSecret.encrypt(code);
};

export const assertAuthorizationOTP = (authorization: Authorization, otpCode: string): void => {
  cryptoSecret.assert(otpCode, authorization.otpCode);
};
