import { Router } from "@lindorm-io/koa";
import { clientMiddleware, requestLimitMiddleware } from "../../middleware";
import { router as authorizeRoute } from "./authorize";
import { router as tokenRoute } from "./token";

export const router = new Router();

router.use(requestLimitMiddleware);
router.use(clientMiddleware);

router.use("/authorize", authorizeRoute.routes(), authorizeRoute.allowedMethods());
router.use("/token", tokenRoute.routes(), tokenRoute.allowedMethods());
