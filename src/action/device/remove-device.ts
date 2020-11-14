import { IAuthContext } from "../../typing";
import { assertAccountPermission } from "../../support";
import Joi from "@hapi/joi";

export interface IRemoveDeviceOptions {
  deviceId: string;
}

const schema = Joi.object({
  deviceId: Joi.string().guid().required(),
});

export const removeDevice = (ctx: IAuthContext) => async (options: IRemoveDeviceOptions): Promise<void> => {
  await schema.validateAsync(options);

  const { account, logger, repository } = ctx;
  const { deviceId } = options;

  const device = await repository.device.find({ id: deviceId });

  await assertAccountPermission(ctx)(device.accountId);

  await repository.device.remove(device);

  logger.debug("device removed", {
    accountId: account.id,
    deviceId: device.id,
  });
};