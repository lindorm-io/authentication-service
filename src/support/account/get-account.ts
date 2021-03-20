import { Account } from "../../entity";
import { IKoaAuthContext } from "../../typing";
import { assertAccountPermission } from "./permission";

export const getAccount = (ctx: IKoaAuthContext) => async (accountId: string): Promise<Account> => {
  const { account, repository } = ctx;

  await assertAccountPermission(ctx)(accountId);

  if (account.id === accountId) {
    return account;
  }

  return repository.account.find({ id: accountId });
};
