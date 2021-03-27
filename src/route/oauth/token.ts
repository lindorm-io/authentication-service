import { GrantType } from "../../enum";
import { HttpStatus } from "@lindorm-io/core";
import { IKoaAuthContext } from "../../typing";
import { Router } from "@lindorm-io/koa";
import { requestLimitSuccessMiddleware, tokenValidationMiddleware } from "../../middleware";
import {
  performDevicePINToken,
  performDeviceSecretToken,
  performEmailLinkToken,
  performEmailOTPToken,
  performMultiFactorToken,
  performPasswordToken,
  performRefreshToken,
} from "../../action";

export const router = new Router();

router.use(tokenValidationMiddleware);
router.use(requestLimitSuccessMiddleware);

router.post(
  "/",
  async (ctx: IKoaAuthContext): Promise<void> => {
    const {
      bindingCode,
      certificateVerifier,
      codeVerifier,
      deviceId,
      grantType,
      otpCode,
      password,
      pin,
      responseType,
      secret,
      subject,
    } = ctx.request.body;

    switch (grantType) {
      case GrantType.DEVICE_PIN:
        ctx.body = await performDevicePINToken(ctx)({
          certificateVerifier,
          codeVerifier,
          deviceId,
          grantType,
          pin,
          subject,
        });
        break;

      case GrantType.DEVICE_SECRET:
        ctx.body = await performDeviceSecretToken(ctx)({
          certificateVerifier,
          codeVerifier,
          deviceId,
          grantType,
          secret,
          subject,
        });
        break;

      case GrantType.EMAIL_LINK:
        ctx.body = await performEmailLinkToken(ctx)({
          codeVerifier,
          grantType,
          subject,
        });
        break;

      case GrantType.EMAIL_OTP:
        ctx.body = await performEmailOTPToken(ctx)({
          codeVerifier,
          grantType,
          otpCode,
          subject,
        });
        break;

      case GrantType.MULTI_FACTOR_OOB:
      case GrantType.MULTI_FACTOR_OTP:
        ctx.body = await performMultiFactorToken(ctx)({
          bindingCode,
          grantType,
          subject,
        });
        break;

      case GrantType.PASSWORD:
        ctx.body = await performPasswordToken(ctx)({
          codeVerifier,
          grantType,
          password,
          subject,
        });
        break;

      case GrantType.REFRESH_TOKEN:
        ctx.body = await performRefreshToken(ctx)({
          grantType,
          responseType,
          subject,
        });
        break;

      default:
        throw new Error("unsupported grant type");
    }

    ctx.status = HttpStatus.Success.OK;
  },
);
