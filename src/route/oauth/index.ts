import { CRYPTO_SECRET_OPTIONS } from "../../config";
import { HttpStatus } from "@lindorm-io/core";
import { IKoaAuthContext } from "../../typing";
import { Router } from "@lindorm-io/koa";
import { clientMiddleware, clientValidationMiddleware } from "@lindorm-io/koa-client";
import { requestLimitMiddleware } from "../../middleware";
import { router as authorization } from "./authorization";
import { router as token } from "./token";

export const router = new Router();

router.use(requestLimitMiddleware);
router.use(clientMiddleware());
router.use(clientValidationMiddleware(CRYPTO_SECRET_OPTIONS));

router.use("/authorization", authorization.routes(), authorization.allowedMethods());
router.use("/token", token.routes(), token.allowedMethods());

router.get(
  "/",
  async (ctx: IKoaAuthContext): Promise<void> => {
    ctx.body = {};
    ctx.status = HttpStatus.ClientError.NOT_FOUND;
  },
);
