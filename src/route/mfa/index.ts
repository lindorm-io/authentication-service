import { HttpStatus } from "@lindorm-io/core";
import { IAuthContext } from "../../typing";
import { Router } from "@lindorm-io/koa";
import { clientMiddleware, tokenValidationMiddleware } from "../../middleware";
import { performMultiFactorChallenge } from "../../action/oauth/multi-factor";

export const router = new Router();

router.use(clientMiddleware);
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
