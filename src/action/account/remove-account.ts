import Joi from "@hapi/joi";
import { IAuthContext } from "../../typing";
import { assertAccountAdmin } from "../../support";

export interface IRemoveAccountOptions {
  accountId: string;
}

const schema = Joi.object({
  accountId: Joi.string().guid().required(),
});

export const removeAccount = (ctx: IAuthContext) => async (options: IRemoveAccountOptions): Promise<void> => {
  await schema.validateAsync(options);

  const { account: admin, logger, repository } = ctx;
  const { accountId } = options;

  const account = await repository.account.find({ id: accountId });

  await assertAccountAdmin(ctx)();

  await repository.account.remove(account);

  logger.debug("account removed", {
    adminId: admin.id,
    accountId: account.id,
  });
};
