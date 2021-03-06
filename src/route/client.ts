import { HttpStatus } from "@lindorm-io/core";
import { IKoaAuthContext } from "../typing";
import { Router } from "@lindorm-io/koa";
import { accountMiddleware, bearerAuthMiddleware } from "../middleware";
import { createClient, removeClient, updateClient } from "../action";

export const router = new Router();

router.use(bearerAuthMiddleware);
router.use(accountMiddleware);

router.post(
  "/",
  async (ctx: IKoaAuthContext): Promise<void> => {
    const { description, emailAuthorizationUri, name, secret } = ctx.request.body;

    ctx.body = await createClient(ctx)({
      description,
      emailAuthorizationUri,
      name,
      secret,
    });
    ctx.status = HttpStatus.Success.CREATED;
  },
);

router.patch(
  "/:id",
  async (ctx: IKoaAuthContext): Promise<void> => {
    const { approved, description, emailAuthorizationUri, name, secret } = ctx.request.body;

    await updateClient(ctx)({
      approved,
      clientId: ctx.params.id,
      description,
      emailAuthorizationUri,
      name,
      secret,
    });

    ctx.body = {};
    ctx.status = HttpStatus.Success.NO_CONTENT;
  },
);

router.delete(
  "/:id",
  async (ctx: IKoaAuthContext): Promise<void> => {
    await removeClient(ctx)({
      clientId: ctx.params.id,
    });

    ctx.body = {};
    ctx.status = HttpStatus.Success.ACCEPTED;
  },
);
