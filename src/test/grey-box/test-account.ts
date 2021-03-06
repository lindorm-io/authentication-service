import { Account, IAccountOTP } from "../../entity";
import { CryptoAES } from "@lindorm-io/crypto";
import { IOTPHandlerGenerateData, OTPHandler } from "../../class";
import { config } from "../../config";
import { Permission } from "@lindorm-io/jwt";
import { authenticator } from "otplib";
import { baseParse } from "@lindorm-io/core";
import { encryptAccountPassword } from "../../support";

const aes = new CryptoAES({
  secret: config.CRYPTO_AES_SECRET,
});
const handler = new OTPHandler({
  issuer: config.ACCOUNT_OTP_ISSUER,
  secret: config.CRYPTO_AES_SECRET,
});

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

export const getTestAccount = (email: string): Account =>
  new Account({
    email,
  });

export const getTestAccountAdmin = (email: string): Account =>
  new Account({
    email,
    permission: Permission.ADMIN,
  });

export const getTestAccountWithPassword = async (email: string): Promise<Account> =>
  new Account({
    email,
    password: {
      signature: await encryptAccountPassword("test_account_password"),
      updated: new Date(),
    },
  });

export const getTestAccountWithOTP = async (email: string, otp: IAccountOTP): Promise<Account> =>
  new Account({
    email,
    password: {
      signature: await encryptAccountPassword("test_account_password"),
      updated: new Date(),
    },
    otp,
  });
