import { BEARER_TOKEN_MW_OPTIONS, CRYPTO_SECRET_OPTIONS } from "../../config";
import { HttpStatus } from "@lindorm-io/core";
import { IKoaAuthContext } from "../../typing";
import { Router } from "@lindorm-io/koa";
import { accountMiddleware } from "../../middleware";
import { bearerTokenMiddleware } from "@lindorm-io/koa-jwt";
import { clientMiddleware, clientValidationMiddleware } from "@lindorm-io/koa-client";
import { logoutWithId } from "../../action";
import { router as logout } from "./logout";

export const router = new Router();

router.use(clientMiddleware());
router.use(clientValidationMiddleware(CRYPTO_SECRET_OPTIONS));
router.use(bearerTokenMiddleware(BEARER_TOKEN_MW_OPTIONS));
router.use(accountMiddleware);

router.use("/logout", logout.routes(), logout.allowedMethods());

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
