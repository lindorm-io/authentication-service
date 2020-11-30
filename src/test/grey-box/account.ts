import { Account, IAccountOTP } from "../../entity";
import { CryptoAES } from "@lindorm-io/crypto";
import { IOTPHandlerGenerateData, OTPHandler } from "../../class";
import { OTP_HANDLER_OPTIONS } from "../../config";
import { Permission } from "@lindorm-io/jwt";
import { authenticator } from "otplib";
import { baseParse } from "@lindorm-io/core";
import { encryptAccountPassword } from "../../support/account";

const aes = new CryptoAES(OTP_HANDLER_OPTIONS);
const handler = new OTPHandler(OTP_HANDLER_OPTIONS);

export interface IGenerateTestAccountOTPData {
  otp: IOTPHandlerGenerateData;
  bindingCode: string;
}

export const generateTestAccountOTP = (): IGenerateTestAccountOTPData => {
  const otp = handler.generate();
  const otpSecret = aes.decrypt(baseParse(otp.signature));
  const bindingCode = authenticator.generate(otpSecret);

  return {
    otp,
    bindingCode,
  };
};

export const getGreyBoxAccount = (email: string): Account =>
  new Account({
    email,
  });

export const getGreyBoxAccountAdmin = (email: string): Account =>
  new Account({
    email,
    permission: Permission.ADMIN,
  });

export const getGreyBoxAccountWithPassword = async (email: string): Promise<Account> =>
  new Account({
    email,
    password: {
      signature: await encryptAccountPassword("test_account_password"),
      updated: new Date(),
    },
  });

export const getGreyBoxAccountWithOTP = async (email: string, otp: IAccountOTP): Promise<Account> =>
  new Account({
    email,
    password: {
      signature: await encryptAccountPassword("test_account_password"),
      updated: new Date(),
    },
    otp,
  });
