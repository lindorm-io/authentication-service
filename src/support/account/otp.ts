import { Account } from "../../entity";
import { config } from "../../config";
import { IOTPHandlerGenerateData, OTPHandler } from "../../class";

const handler = new OTPHandler({
  issuer: config.ACCOUNT_OTP_ISSUER,
  secret: config.CRYPTO_AES_SECRET,
});

export const generateAccountOTP = (): IOTPHandlerGenerateData => {
  return handler.generate();
};

export const assertAccountOTP = (account: Account, bindingCode: string): void => {
  handler.assert(bindingCode, account.otp.signature);
};
