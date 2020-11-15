import Joi from "@hapi/joi";
import { IAuthContext } from "../../typing";
import { assertAccountPermission, assertBearerTokenScope } from "../../support";
import { Scope } from "@lindorm-io/jwt";

export interface IUpdateDeviceName {
  deviceId: string;
  name: string;
}

const schema = Joi.object({
  deviceId: Joi.string().guid().required(),
  name: Joi.string().required(),
});

export const updateDeviceName = (ctx: IAuthContext) => async (options: IUpdateDeviceName): Promise<void> => {
  await schema.validateAsync(options);

  const { account, logger, repository } = ctx;
  const { deviceId, name } = options;

  const device = await repository.device.find({ id: deviceId });

  assertBearerTokenScope(ctx)([Scope.DEFAULT, Scope.OPENID]);
  await assertAccountPermission(ctx)(device.accountId);

  device.name = name;

  await repository.device.update(device);

  logger.debug("device updated", {
    accountId: account.id,
    deviceId: device.id,
  });
};
