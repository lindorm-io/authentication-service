import { HttpStatus } from "@lindorm-io/core";
import { IAuthContext } from "../../typing";
import { Router } from "@lindorm-io/koa";
import { clientMiddleware, deviceMiddleware, requestLimitMiddleware } from "../../middleware";
import { router as authorization } from "./authorization";
import { router as token } from "./token";

export const router = new Router();

router.use(requestLimitMiddleware);
router.use(clientMiddleware);
router.use(deviceMiddleware({ throwError: false }));

router.use("/authorization", authorization.routes(), authorization.allowedMethods());
router.use("/token", token.routes(), token.allowedMethods());

router.get(
  "/",
  async (ctx: IAuthContext): Promise<void> => {
    ctx.body = {};
    ctx.status = HttpStatus.ClientError.NOT_FOUND;
  },
);
