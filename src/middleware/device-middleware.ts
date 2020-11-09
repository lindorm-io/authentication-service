import { IAuthContext } from "../typing";
import { InvalidDeviceError } from "../error";
import { TPromise } from "@lindorm-io/core";
import Joi from "@hapi/joi";

export interface IDeviceMiddlewareOptions {
  throwError: boolean;
}

const schema = Joi.object({
  deviceId: Joi.string().guid().required(),
});

export const deviceMiddleware = (options: IDeviceMiddlewareOptions) => async (
  ctx: IAuthContext,
  next: TPromise<void>,
): Promise<void> => {
  const start = Date.now();

  const { logger, repository } = ctx;
  const { throwError } = options;
  const { deviceId } = ctx.request.body;

  try {
    await schema.validateAsync({ deviceId });

    ctx.device = await repository.device.find({ id: deviceId });

    logger.debug("device found", { deviceId });
  } catch (err) {
    if (throwError) {
      throw new InvalidDeviceError(deviceId, err);
    }

    logger.debug("device not found", { deviceId });
  }

  ctx.metrics = {
    ...(ctx.metrics || {}),
    device: Date.now() - start,
  };

  await next();
};
