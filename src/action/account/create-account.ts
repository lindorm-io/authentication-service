import Joi from "@hapi/joi";
import { Account } from "../../entity";
import { IKoaAuthContext } from "../../typing";
import { JOI_EMAIL, JOI_PERMISSION } from "../../constant";
import { assertAccountAdmin } from "../../support";
import { requestEnsureIdentity } from "../../axios";

export interface ICreateAccountOptions {
  email: string;
  permission: string;
}

export interface ICreateAccountData {
  accountId: string;
}

const schema = Joi.object({
  email: JOI_EMAIL,
  permission: JOI_PERMISSION,
});

export const createAccount = (ctx: IKoaAuthContext) => async (
  options: ICreateAccountOptions,
): Promise<ICreateAccountData> => {
  await schema.validateAsync(options);

  const { account: admin, logger, repository } = ctx;
  const { email, permission } = options;

  await assertAccountAdmin(ctx)();

  const account = new Account({
    email,
    permission,
  });

  await repository.account.create(account);

  logger.debug("account created", {
    adminId: admin.id,
    accountId: account.id,
  });

  const { created, updated } = await requestEnsureIdentity(ctx)(account);

  logger.debug("identity created", { created, updated });

  return { accountId: account.id };
};
