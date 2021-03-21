import { HttpStatus } from "@lindorm-io/core";
import { IKoaAuthContext } from "../typing";
import { Router } from "@lindorm-io/koa";
import { accountMiddleware, bearerAuthMiddleware } from "../middleware";
import { getOpenIdInformation } from "../action";

export const router = new Router();

router.use(bearerAuthMiddleware);
router.use(accountMiddleware);

router.get(
  "/",
  async (ctx: IKoaAuthContext): Promise<void> => {
    ctx.body = await getOpenIdInformation(ctx)();
    ctx.status = HttpStatus.Success.OK;
  },
);
