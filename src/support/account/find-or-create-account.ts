import { Account } from "../../entity";
import { IAuthContext } from "../../typing";
import { InvalidPermissionError } from "../../error";
import { isLocked } from "@lindorm-io/jwt";

export const findOrCreateAccount = (ctx: IAuthContext) => async (email: string): Promise<Account> => {
  const { repository } = ctx;

  const account = await repository.account.findOrCreate({ email });

  if (isLocked(account.permission)) {
    throw new InvalidPermissionError();
  }

  return account;
};
