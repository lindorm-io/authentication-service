import { Authorization } from "../../entity";
import { CRYPTO_SECRET_OPTIONS } from "../../config";
import { CryptoSecret } from "@lindorm-io/crypto";

const cryptoSecret = new CryptoSecret(CRYPTO_SECRET_OPTIONS);

export const encryptAuthorizationOTP = (code: string): string => {
  return cryptoSecret.encrypt(code);
};

export const assertAuthorizationOTP = (authorization: Authorization, otpCode: string): void => {
  cryptoSecret.assert(otpCode, authorization.otpCode);
};
