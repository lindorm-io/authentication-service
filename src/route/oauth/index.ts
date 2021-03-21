import { HttpStatus } from "@lindorm-io/core";
import { IKoaAuthContext } from "../../typing";
import { Router } from "@lindorm-io/koa";
import { clientMiddleware, requestLimitMiddleware } from "../../middleware";
import { router as authorizationRoute } from "./authorization";
import { router as tokenRoute } from "./token";

export const router = new Router();

router.use(requestLimitMiddleware);
router.use(clientMiddleware);

router.use("/authorization", authorizationRoute.routes(), authorizationRoute.allowedMethods());
router.use("/token", tokenRoute.routes(), tokenRoute.allowedMethods());

router.get(
  "/",
  async (ctx: IKoaAuthContext): Promise<void> => {
    ctx.body = {};
    ctx.status = HttpStatus.ClientError.NOT_FOUND;
  },
);
