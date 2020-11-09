import { Account } from "../../entity";
import { OTP_HANDLER_OPTIONS } from "../../config";
import { IOTPHandlerGenerateData, OTPHandler } from "../../class";

const handler = new OTPHandler(OTP_HANDLER_OPTIONS);

export const generateAccountOTP = (): IOTPHandlerGenerateData => {
  return handler.generate();
};

export const assertAccountOTP = (account: Account, bindingCode: string): void => {
  handler.assert(bindingCode, account.otp.signature);
};
