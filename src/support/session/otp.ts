import { CRYPTO_SECRET_OPTIONS } from "../../config";
import { CryptoSecret } from "@lindorm-io/crypto";
import { Session } from "../../entity";

const cryptoSecret = new CryptoSecret(CRYPTO_SECRET_OPTIONS);

export const encryptSessionOTP = (code: string): string => {
  return cryptoSecret.encrypt(code);
};

export const assertSessionOTP = (session: Session, otpCode: string): void => {
  cryptoSecret.assert(otpCode, session.authorization.otpCode);
};
