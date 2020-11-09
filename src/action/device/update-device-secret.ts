import Joi from "@hapi/joi";
import { IAuthContext } from "../../typing";
import { assertAccountPermission, assertDevicePIN, encryptDeviceSecret } from "../../support";

export interface IChangeDeviceSecretOptions {
  deviceId: string;
  pin: string;
  updatedSecret: string;
}

const schema = Joi.object({
  deviceId: Joi.string().guid().required(),
  pin: Joi.string().length(6).required(),
  updatedSecret: Joi.string().required(),
});

export const updateDeviceSecret = (ctx: IAuthContext) => async (options: IChangeDeviceSecretOptions): Promise<void> => {
  await schema.validateAsync(options);

  const { account, logger, repository } = ctx;
  const { deviceId, pin, updatedSecret } = options;

  const device = await repository.device.find({ id: deviceId });

  await assertAccountPermission(ctx)(device.accountId);
  await assertDevicePIN(device, pin);

  device.secret = await encryptDeviceSecret(updatedSecret);

  await repository.device.update(device);

  logger.debug("device secret updated", {
    accountId: account.id,
    deviceId: device.id,
  });
};
