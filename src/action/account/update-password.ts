import Joi from "@hapi/joi";
import { IAuthContext } from "../../typing";
import { assertAccountPassword, encryptAccountPassword } from "../../support";

export interface IUpdateAccountPasswordOptions {
  password: string;
  updatedPassword: string;
}

const schema = Joi.object({
  password: Joi.string(),
  updatedPassword: Joi.string().required(),
});

export const updateAccountPassword = (ctx: IAuthContext) => async (
  options: IUpdateAccountPasswordOptions,
): Promise<void> => {
  await schema.validateAsync(options);

  const { account, logger, repository } = ctx;
  const { password, updatedPassword } = options;

  if (account.password.signature) {
    await assertAccountPassword(account, password);
  }

  account.password = {
    signature: await encryptAccountPassword(updatedPassword),
    updated: new Date(),
  };

  await repository.account.update(account);

  logger.debug("device password updated", {
    accountId: account.id,
  });
};
