import { HttpStatus } from "@lindorm-io/core";
import { IAuthContext } from "../../typing";
import { Router } from "@lindorm-io/koa";
import { logoutWithToken } from "../../action";
import { tokenValidationMiddleware } from "../../middleware";

export const router = new Router();

router.use(tokenValidationMiddleware);

router.post(
  "/",
  async (ctx: IAuthContext): Promise<void> => {
    await logoutWithToken(ctx)();

    ctx.body = {};
    ctx.status = HttpStatus.Success.ACCEPTED;
  },
);
