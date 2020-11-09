import { IAuthContext } from "../../typing";
import { assertAccountPermission } from "./permission";

export const getAccount = (ctx: IAuthContext) => async (accountId: string) => {
  const { account, repository } = ctx;

  await assertAccountPermission(ctx)(accountId);

  if (account.id === accountId) {
    return account;
  }

  return repository.account.find({ id: accountId });
};
