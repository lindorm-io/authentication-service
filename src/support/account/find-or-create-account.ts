import { Account } from "../../entity";
import { IKoaAuthContext } from "../../typing";
import { InvalidPermissionError } from "../../error";
import { ensureIdentity } from "../../axios";
import { isLocked } from "@lindorm-io/jwt";

export const findOrCreateAccount = (ctx: IKoaAuthContext) => async (email: string): Promise<Account> => {
  const { repository } = ctx;

  const account = await repository.account.findOrCreate({ email });

  if (isLocked(account.permission)) {
    throw new InvalidPermissionError();
  }

  if (!account.identityId) {
    await ensureIdentity(account.id);
    account.identityId = account.id;
    await repository.account.update(account);
  }

  return account;
};
