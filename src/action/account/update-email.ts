import Joi from "@hapi/joi";
import { IAuthContext } from "../../typing";
import { JOI_EMAIL } from "../../constant";

export interface IUpdateAccountEmailOptions {
  updatedEmail: string;
}

const schema = Joi.object({
  updatedEmail: JOI_EMAIL,
});

export const updateAccountEmail = (ctx: IAuthContext) => async (options: IUpdateAccountEmailOptions): Promise<void> => {
  await schema.validateAsync(options);

  const { account, logger, repository } = ctx;
  const { updatedEmail } = options;

  account.email = updatedEmail;

  await repository.account.update(account);

  logger.debug("device email updated", {
    accountId: account.id,
    email: updatedEmail,
  });
};
