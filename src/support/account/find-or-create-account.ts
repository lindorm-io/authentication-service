import { Account } from "../../entity";
import { IKoaAuthContext } from "../../typing";
import { InvalidPermissionError } from "../../error";
import { requestEnsureIdentity } from "../../axios";
import { isLocked } from "@lindorm-io/jwt";

export const findOrCreateAccount = (ctx: IKoaAuthContext) => async (email: string): Promise<Account> => {
  const { repository } = ctx;

  const account = await repository.account.findOrCreate({ email });

  if (isLocked(account.permission)) {
    throw new InvalidPermissionError();
  }

  if (!account.identityLinked) {
    await requestEnsureIdentity(ctx)(account);

    account.identityLinked = true;

    await repository.account.update(account);
  }

  return account;
};
