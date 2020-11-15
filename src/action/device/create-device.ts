import Joi from "@hapi/joi";
import { Device } from "../../entity";
import { IAuthContext } from "../../typing";
import { assertAccountPermission, assertBearerTokenScope, encryptDevicePIN, encryptDeviceSecret } from "../../support";
import { Scope } from "@lindorm-io/jwt";

export interface ICreateDeviceOptions {
  name: string;
  pin: string;
  publicKey: string;
  secret: string;
}

export interface ICreateDeviceData {
  deviceId: string;
}

const schema = Joi.object({
  name: Joi.string(),
  pin: Joi.string().length(6).required(),
  publicKey: Joi.string().required(),
  secret: Joi.string(),
});

export const createDevice = (ctx: IAuthContext) => async (
  options: ICreateDeviceOptions,
): Promise<ICreateDeviceData> => {
  await schema.validateAsync(options);

  const { account, logger, repository } = ctx;
  const { name, pin, publicKey, secret } = options;

  assertBearerTokenScope(ctx)([Scope.DEFAULT, Scope.OPENID]);
  await assertAccountPermission(ctx)(account.id);

  const device = new Device({
    accountId: account.id,
    pin: {
      signature: await encryptDevicePIN(pin),
      updated: new Date(),
    },
    publicKey,
  });

  device.create();

  if (name) {
    device.name = name;
  }
  if (secret) {
    device.secret = await encryptDeviceSecret(secret);
  }

  await repository.device.create(device);

  logger.debug("device created", {
    accountId: account.id,
    deviceId: device.id,
  });

  return { deviceId: device.id };
};
