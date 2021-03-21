import { HttpStatus } from "@lindorm-io/core";
import { IKoaAuthContext } from "../typing";
import { Router } from "@lindorm-io/koa";
import { performMultiFactorChallenge } from "../action";
import { clientMiddleware, tokenValidationMiddleware } from "../middleware";

export const router = new Router();

router.use(clientMiddleware);
router.use(tokenValidationMiddleware);

router.post(
  "/challenge",
  async (ctx: IKoaAuthContext): Promise<void> => {
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
