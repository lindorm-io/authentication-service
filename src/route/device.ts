import { BEARER_TOKEN_MW_OPTIONS } from "../config";
import { HttpStatus } from "@lindorm-io/core";
import { IAuthContext } from "../typing";
import { Router } from "@lindorm-io/koa";
import { accountMiddleware } from "../middleware";
import { bearerTokenMiddleware } from "@lindorm-io/koa-jwt";
import { createDevice, removeDevice, updateDeviceName, updateDevicePIN, updateDeviceSecret } from "../action";

export const router = new Router();

router.use(bearerTokenMiddleware(BEARER_TOKEN_MW_OPTIONS));
router.use(accountMiddleware);

router.post(
  "/",
  async (ctx: IAuthContext): Promise<void> => {
    const { name, pin, publicKey, secret } = ctx.request.body;

    ctx.body = await createDevice(ctx)({
      name,
      pin,
      publicKey,
      secret,
    });
    ctx.status = HttpStatus.Success.CREATED;
  },
);

router.delete(
  "/:id",
  async (ctx: IAuthContext): Promise<void> => {
    await removeDevice(ctx)({
      deviceId: ctx.params.id,
    });

    ctx.body = {};
    ctx.status = HttpStatus.Success.ACCEPTED;
  },
);

router.patch(
  "/:id/name",
  async (ctx: IAuthContext): Promise<void> => {
    const { name } = ctx.request.body;

    await updateDeviceName(ctx)({
      deviceId: ctx.params.id,
      name,
    });

    ctx.body = {};
    ctx.status = HttpStatus.Success.NO_CONTENT;
  },
);

router.patch(
  "/:id/pin",
  async (ctx: IAuthContext): Promise<void> => {
    const { pin, updatedPin } = ctx.request.body;

    await updateDevicePIN(ctx)({
      deviceId: ctx.params.id,
      pin,
      updatedPin,
    });

    ctx.body = {};
    ctx.status = HttpStatus.Success.NO_CONTENT;
  },
);

router.patch(
  "/:id/secret",
  async (ctx: IAuthContext): Promise<void> => {
    const { pin, updatedSecret } = ctx.request.body;

    await updateDeviceSecret(ctx)({
      deviceId: ctx.params.id,
      pin,
      updatedSecret,
    });

    ctx.body = {};
    ctx.status = HttpStatus.Success.NO_CONTENT;
  },
);
