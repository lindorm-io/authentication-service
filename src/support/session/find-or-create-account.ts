import { Account } from "../../entity";
import { IAuthContext } from "../../typing";
import { RepositoryEntityNotFoundError } from "@lindorm-io/mongo";
import { Permission } from "../../enum";
import { InvalidPermissionError } from "../../error";

export const findOrCreateAccount = (ctx: IAuthContext) => async (email: string): Promise<Account> => {
  const { repository } = ctx;

  try {
    const account = await repository.account.find({ email });

    if (account.permission === Permission.LOCKED) {
      throw new InvalidPermissionError();
    }

    return account;
  } catch (err) {
    if (err instanceof RepositoryEntityNotFoundError) {
      const account = new Account({ email });
      account.create();

      return repository.account.create(account);
    }

    throw err;
  }
};
