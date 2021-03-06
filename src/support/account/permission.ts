import { AccountNotFoundError, InvalidPermissionError } from "../../error";
import { IKoaAuthContext } from "../../typing";
import { isAdmin } from "@lindorm-io/jwt";

export const assertAccountPermission = (ctx: IKoaAuthContext) => (accountId: string): Promise<void> => {
  const { account } = ctx;

  if (!account) {
    throw new AccountNotFoundError(accountId);
  }

  if (isAdmin(account.permission)) {
    return;
  }

  if (account.id === accountId) {
    return;
  }

  throw new InvalidPermissionError();
};

export const assertAccountAdmin = (ctx: IKoaAuthContext) => (): Promise<void> => {
  const { account } = ctx;

  if (!account) {
    throw new AccountNotFoundError();
  }

  if (isAdmin(account.permission)) {
    return;
  }

  throw new InvalidPermissionError();
};
