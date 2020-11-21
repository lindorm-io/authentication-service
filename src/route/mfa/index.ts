import { CRYPTO_SECRET_OPTIONS } from "../../config";
import { HttpStatus } from "@lindorm-io/core";
import { IAuthContext } from "../../typing";
import { Router } from "@lindorm-io/koa";
import { clientValidationMiddleware } from "@lindorm-io/koa-client";
import { performMultiFactorChallenge } from "../../action/oauth/multi-factor";
import { tokenValidationMiddleware } from "../../middleware";

export const router = new Router();

router.use(clientValidationMiddleware(CRYPTO_SECRET_OPTIONS));
router.use(tokenValidationMiddleware);

router.post(
  "/challenge",
  async (ctx: IAuthContext): Promise<void> => {
    const { authenticatorId, challengeType, grantType, subject } = ctx.request.body;

    ctx.body = await performMultiFactorChallenge(ctx)({
      authenticatorId,
      challengeType,
      grantType,
      subject,
    });

    ctx.status = HttpStatus.Success.OK;
  },
);
