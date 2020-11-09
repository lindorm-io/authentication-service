import { BEARER_TOKEN_MW_OPTIONS } from "../config";
import { HttpStatus } from "@lindorm-io/core";
import { IAuthContext } from "../typing";
import { Router } from "@lindorm-io/koa";
import { accountMiddleware } from "../middleware";
import { bearerTokenMiddleware } from "@lindorm-io/koa-jwt";
import { createKeyPair, expireKeyPair } from "../action";

export const router = new Router();

router.use(bearerTokenMiddleware(BEARER_TOKEN_MW_OPTIONS));
router.use(accountMiddleware);

router.post(
  "/",
  async (ctx: IAuthContext): Promise<void> => {
    const { type } = ctx.request.body;

    ctx.body = await createKeyPair(ctx)({ type });
    ctx.status = HttpStatus.Success.CREATED;
  },
);

router.patch(
  "/:id/expire",
  async (ctx: IAuthContext): Promise<void> => {
    const { expires } = ctx.request.body;

    await expireKeyPair(ctx)({
      keyPairId: ctx.params.id,
      expires,
    });

    ctx.body = {};
    ctx.status = HttpStatus.Success.NO_CONTENT;
  },
);
