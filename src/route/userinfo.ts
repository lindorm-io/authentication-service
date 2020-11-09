import { BEARER_TOKEN_MW_OPTIONS } from "../config";
import { HttpStatus } from "@lindorm-io/core";
import { IAuthContext } from "../typing";
import { Router } from "@lindorm-io/koa";
import { accountMiddleware } from "../middleware";
import { bearerTokenMiddleware } from "@lindorm-io/koa-jwt";
import { getOpenIdInformation } from "../action/account";

export const router = new Router();

router.use(bearerTokenMiddleware(BEARER_TOKEN_MW_OPTIONS));
router.use(accountMiddleware);

router.get(
  "/",
  async (ctx: IAuthContext): Promise<void> => {
    ctx.body = await getOpenIdInformation(ctx)();
    ctx.status = HttpStatus.Success.OK;
  },
);
