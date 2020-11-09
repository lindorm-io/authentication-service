import Joi from "@hapi/joi";
import { IAuthContext } from "../../typing";
import { assertAccountOTP, getAccount } from "../../support";
import { Permission } from "../../enum";

export interface IRemoveAccountOTPOptions {
  accountId: string;
  bindingCode: string;
}

const schema = Joi.object({
  accountId: Joi.string().guid().required(),
  bindingCode: Joi.string().required(),
});

export const removeAccountOTP = (ctx: IAuthContext) => async (options: IRemoveAccountOTPOptions): Promise<void> => {
  await schema.validateAsync(options);

  const { account: requesterAccount, logger, repository } = ctx;
  const { accountId, bindingCode } = options;

  const account = await getAccount(ctx)(accountId);

  if (requesterAccount.permission !== Permission.ADMIN) {
    assertAccountOTP(account, bindingCode);
  }

  account.otp = {
    signature: null,
    uri: null,
  };

  await repository.account.update(account);

  logger.debug("account otp updated", {
    accountId: account.id,
  });
};
