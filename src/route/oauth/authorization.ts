import { GrantType } from "../../enum";
import { HttpStatus } from "@lindorm-io/core";
import { IAuthContext } from "../../typing";
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
  async (ctx: IAuthContext): Promise<void> => {
    const { codeChallenge, codeMethod, grantType, redirectUri, responseType, scope, state, subject } = ctx.request.body;

    const options = {
      codeChallenge,
      codeMethod,
      grantType,
      redirectUri,
      responseType,
      scope,
      state,
      subject,
    };

    switch (grantType) {
      case GrantType.DEVICE_PIN:
        ctx.body = await performDevicePINInit(ctx)(options);
        break;

      case GrantType.DEVICE_SECRET:
        ctx.body = await performDeviceSecretInit(ctx)(options);
        break;

      case GrantType.EMAIL_LINK:
        ctx.body = await performEmailLinkInit(ctx)(options);
        break;

      case GrantType.EMAIL_OTP:
        ctx.body = await performEmailOTPInit(ctx)(options);
        break;

      case GrantType.PASSWORD:
        ctx.body = await performPasswordInit(ctx)(options);
        break;

      default:
        throw new Error("unsupported grant type");
    }

    ctx.status = HttpStatus.Success.OK;
  },
);
