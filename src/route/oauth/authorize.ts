import { GrantType } from "../../enum";
import { HttpStatus } from "@lindorm-io/core";
import { IKoaAuthContext } from "../../typing";
import { Router } from "@lindorm-io/koa";
import {
  performDevicePINInit,
  performDeviceSecretInit,
  performEmailLinkInit,
  performEmailOTPInit,
  performPasswordInit,
} from "../../action";

export const router = new Router();

router.post(
  "/",
  async (ctx: IKoaAuthContext): Promise<void> => {
    const {
      codeChallenge,
      codeMethod,
      deviceId,
      grantType,
      redirectUri,
      responseType,
      scope,
      state,
      subject,
    } = ctx.request.body;

    switch (grantType) {
      case GrantType.DEVICE_PIN:
        ctx.body = await performDevicePINInit(ctx)({
          codeChallenge,
          codeMethod,
          deviceId,
          redirectUri,
          responseType,
          scope,
          state,
          subject,
        });
        break;

      case GrantType.DEVICE_SECRET:
        ctx.body = await performDeviceSecretInit(ctx)({
          codeChallenge,
          codeMethod,
          deviceId,
          redirectUri,
          responseType,
          scope,
          state,
          subject,
        });
        break;

      case GrantType.EMAIL_LINK:
        ctx.body = await performEmailLinkInit(ctx)({
          codeChallenge,
          codeMethod,
          grantType,
          redirectUri,
          responseType,
          scope,
          state,
          subject,
        });
        break;

      case GrantType.EMAIL_OTP:
        ctx.body = await performEmailOTPInit(ctx)({
          codeChallenge,
          codeMethod,
          grantType,
          redirectUri,
          responseType,
          scope,
          state,
          subject,
        });
        break;

      case GrantType.PASSWORD:
        ctx.body = await performPasswordInit(ctx)({
          codeChallenge,
          codeMethod,
          grantType,
          redirectUri,
          responseType,
          scope,
          state,
          subject,
        });
        break;

      default:
        throw new Error("unsupported grant type");
    }

    ctx.status = HttpStatus.Success.OK;
  },
);
