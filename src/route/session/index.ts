import { HttpStatus } from "@lindorm-io/core";
import { IKoaAuthContext } from "../../typing";
import { Router } from "@lindorm-io/koa";
import { accountMiddleware, bearerAuthMiddleware } from "../../middleware";
import { logoutWithId } from "../../action";
import { router as logoutRoute } from "./logout";

export const router = new Router();

router.use(bearerAuthMiddleware);
router.use(accountMiddleware);

router.use("/logout", logoutRoute.routes(), logoutRoute.allowedMethods());

router.get(
  "/",
  async (ctx: IKoaAuthContext): Promise<void> => {
    ctx.body = {};
    ctx.status = HttpStatus.ClientError.NOT_FOUND;
  },
);

router.delete(
  "/:id",
  async (ctx: IKoaAuthContext): Promise<void> => {
    await logoutWithId(ctx)({
      sessionId: ctx.params.id,
    });

    ctx.body = {};
    ctx.status = HttpStatus.Success.ACCEPTED;
  },
);
