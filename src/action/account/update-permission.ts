import Joi from "@hapi/joi";
import { IKoaAuthContext } from "../../typing";
import { JOI_PERMISSION } from "../../constant";
import { Permission } from "@lindorm-io/jwt";
import { assertAccountAdmin } from "../../support";

export interface IUpdateAccountPermission {
  accountId: string;
  permission: Permission;
}

const schema = Joi.object({
  accountId: Joi.string().guid().required(),
  permission: JOI_PERMISSION,
});

export const updateAccountPermission = (ctx: IKoaAuthContext) => async (
  options: IUpdateAccountPermission,
): Promise<void> => {
  await schema.validateAsync(options);

  const { account: admin, logger, repository } = ctx;
  const { accountId, permission } = options;

  const account = await repository.account.find({ id: accountId });

  await assertAccountAdmin(ctx)();

  account.permission = permission;

  await repository.account.update(account);

  logger.debug("account permission updated", {
    adminId: admin.id,
    accountId: account.id,
  });
};
