import { Account } from "../../entity";
import { CryptoAES } from "@lindorm-io/crypto";
import { OTP_HANDLER_OPTIONS } from "../../config";
import { authenticator } from "otplib";
import { baseParse, getRandomValue } from "@lindorm-io/core";
import { encryptAccountPassword, generateAccountOTP } from "../../support";
import { Permission } from "@lindorm-io/jwt";

const aes = new CryptoAES(OTP_HANDLER_OPTIONS);

export interface IGenerateTestAccountOptions {
  hasPassword: boolean;
  hasOtp: boolean;
}

export interface IGenerateTestAccountData {
  account: Account;
  id: string;
  email: string;
  bindingCode: string;
  otpSecret: string;
  password: string;
  permission: string;
}

export const generateTestAccount = async ({
  hasPassword,
  hasOtp,
}: IGenerateTestAccountOptions): Promise<IGenerateTestAccountData> => {
  const email = `test.${getRandomValue(8).toLowerCase()}@lindorm.io`;
  const password = getRandomValue(16);
  const otp = generateAccountOTP();
  const otpSecret = aes.decrypt(baseParse(otp.signature));
  const bindingCode = authenticator.generate(otpSecret);

  const account = new Account({
    email,
    permission: Permission.ADMIN,
    password: hasPassword && {
      signature: await encryptAccountPassword(password),
      updated: new Date(),
    },
    otp: hasOtp && otp,
  });
  account.create();

  return {
    account,
    id: account.id,
    email: account.email,
    bindingCode: hasOtp && bindingCode,
    otpSecret: hasOtp && otpSecret,
    password: hasPassword && password,
    permission: account.permission,
  };
};
