import { HttpStatus } from "@lindorm-io/core";
import { IKoaAuthContext } from "../typing";
import { Router } from "@lindorm-io/koa";
import { accountMiddleware, bearerAuthMiddleware } from "../middleware";
import { createKeyPair, expireKeyPair } from "../action";

export const router = new Router();

router.use(bearerAuthMiddleware);
router.use(accountMiddleware);

router.post(
  "/",
  async (ctx: IKoaAuthContext): Promise<void> => {
    const { type } = ctx.request.body;

    ctx.body = await createKeyPair(ctx)({ type });
    ctx.status = HttpStatus.Success.CREATED;
  },
);

router.patch(
  "/:id/expire",
  async (ctx: IKoaAuthContext): Promise<void> => {
    const { expires } = ctx.request.body;

    await expireKeyPair(ctx)({
      keyPairId: ctx.params.id,
      expires,
    });

    ctx.body = {};
    ctx.status = HttpStatus.Success.NO_CONTENT;
  },
);
