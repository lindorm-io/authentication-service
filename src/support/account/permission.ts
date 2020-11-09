import { AccountNotFoundError, InvalidPermissionError } from "../../error";
import { IAuthContext } from "../../typing";
import { Permission } from "../../enum";

export const assertAccountPermission = (ctx: IAuthContext) => (accountId: string): Promise<void> => {
  const { account } = ctx;

  if (!account) {
    throw new AccountNotFoundError(accountId);
  }

  if (account.permission === Permission.ADMIN) {
    return;
  }

  if (account.id === accountId) {
    return;
  }

  throw new InvalidPermissionError();
};

export const assertAccountAdmin = (ctx: IAuthContext) => (): Promise<void> => {
  const { account } = ctx;

  if (!account) {
    throw new AccountNotFoundError();
  }

  if (account.permission === Permission.ADMIN) {
    return;
  }

  throw new InvalidPermissionError();
};
