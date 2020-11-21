import { BEARER_TOKEN_MW_OPTIONS, CRYPTO_SECRET_OPTIONS } from "../../config";
import { HttpStatus } from "@lindorm-io/core";
import { IAuthContext } from "../../typing";
import { Router } from "@lindorm-io/koa";
import { accountMiddleware } from "../../middleware";
import { bearerTokenMiddleware } from "@lindorm-io/koa-jwt";
import { clientValidationMiddleware } from "@lindorm-io/koa-client";
import { logoutWithId } from "../../action/session";
import { router as logout } from "./logout";

export const router = new Router();

router.use(clientValidationMiddleware(CRYPTO_SECRET_OPTIONS));
router.use(bearerTokenMiddleware(BEARER_TOKEN_MW_OPTIONS));
router.use(accountMiddleware);

router.use("/logout", logout.routes(), logout.allowedMethods());

router.get(
  "/",
  async (ctx: IAuthContext): Promise<void> => {
    ctx.body = {};
    ctx.status = HttpStatus.ClientError.NOT_FOUND;
  },
);

router.delete(
  "/:id",
  async (ctx: IAuthContext): Promise<void> => {
    await logoutWithId(ctx)({
      sessionId: ctx.params.id,
    });

    ctx.body = {};
    ctx.status = HttpStatus.Success.ACCEPTED;
  },
);
