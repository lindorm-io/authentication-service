import Joi from "@hapi/joi";
import { IAuthContext } from "../../typing";
import { assertAccountPermission, assertBearerTokenScope, assertDevicePIN, encryptDevicePIN } from "../../support";
import { Scope } from "@lindorm-io/jwt";

export interface IUpdateDevicePinOptions {
  deviceId: string;
  pin: string;
  updatedPin: string;
}

const schema = Joi.object({
  deviceId: Joi.string().guid().required(),
  pin: Joi.string().length(6).required(),
  updatedPin: Joi.string().length(6).required(),
});

export const updateDevicePIN = (ctx: IAuthContext) => async (options: IUpdateDevicePinOptions): Promise<void> => {
  await schema.validateAsync(options);

  const { account, logger, repository } = ctx;
  const { deviceId, pin, updatedPin } = options;

  const device = await repository.device.find({ id: deviceId });

  assertBearerTokenScope(ctx)([Scope.DEFAULT, Scope.OPENID]);
  await assertAccountPermission(ctx)(device.accountId);
  await assertDevicePIN(device, pin);

  device.pin = {
    signature: await encryptDevicePIN(updatedPin),
    updated: new Date(),
  };

  await repository.device.update(device);

  logger.debug("device pin updated", {
    accountId: account.id,
    deviceId: device.id,
  });
};
