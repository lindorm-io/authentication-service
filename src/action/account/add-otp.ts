import { IAuthContext } from "../../typing";
import { generateAccountOTP } from "../../support";

export interface IAddAccountOTPData {
  uri: string;
}

export const addAccountOTP = (ctx: IAuthContext) => async (): Promise<IAddAccountOTPData> => {
  const { account, logger, repository } = ctx;

  if (account.otp.signature) {
    throw new Error("previous needs to be removed before generating a new");
  }

  const { signature, uri } = generateAccountOTP();

  account.otp = { signature, uri };

  await repository.account.update(account);

  logger.debug("account otp updated", {});

  return { uri };
};
