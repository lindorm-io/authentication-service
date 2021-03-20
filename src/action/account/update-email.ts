import Joi from "@hapi/joi";
import { IKoaAuthContext } from "../../typing";
import { JOI_EMAIL } from "../../constant";
import { Scope } from "@lindorm-io/jwt";
import { assertBearerTokenScope } from "../../support";

export interface IUpdateAccountEmailOptions {
  updatedEmail: string;
}

const schema = Joi.object({
  updatedEmail: JOI_EMAIL,
});

export const updateAccountEmail = (ctx: IKoaAuthContext) => async (
  options: IUpdateAccountEmailOptions,
): Promise<void> => {
  await schema.validateAsync(options);

  const { account, logger, repository } = ctx;
  const { updatedEmail } = options;

  assertBearerTokenScope(ctx)([Scope.DEFAULT, Scope.EDIT]);

  account.email = updatedEmail;

  await repository.account.update(account);

  logger.debug("account email updated", {
    accountId: account.id,
    email: updatedEmail,
  });
};
