import { BEARER_TOKEN_MW_OPTIONS } from "../config";
import { HttpStatus } from "@lindorm-io/core";
import { IAuthContext } from "../typing";
import { Router } from "@lindorm-io/koa";
import { accountMiddleware } from "../middleware";
import { bearerTokenMiddleware } from "@lindorm-io/koa-jwt";
import {
  addAccountOTP,
  createAccount,
  getAccountInformation,
  removeAccount,
  removeAccountOTP,
  updateAccountEmail,
  updateAccountPassword,
  updateAccountPermission,
} from "../action";

export const router = new Router();

router.use(bearerTokenMiddleware(BEARER_TOKEN_MW_OPTIONS));
router.use(accountMiddleware);

router.post(
  "/",
  async (ctx: IAuthContext): Promise<void> => {
    const { email, permission } = ctx.request.body;

    ctx.body = await createAccount(ctx)({ email, permission });
    ctx.status = HttpStatus.Success.CREATED;
  },
);

router.get(
  "/:id",
  async (ctx: IAuthContext): Promise<void> => {
    ctx.body = await getAccountInformation(ctx)({
      accountId: ctx.params.id,
    });
    ctx.status = HttpStatus.Success.OK;
  },
);

router.delete(
  "/:id",
  async (ctx: IAuthContext): Promise<void> => {
    await removeAccount(ctx)({
      accountId: ctx.params.id,
    });

    ctx.body = {};
    ctx.status = HttpStatus.Success.NO_CONTENT;
  },
);

router.delete(
  "/:id/otp",
  async (ctx: IAuthContext): Promise<void> => {
    const { bindingCode } = ctx.request.body;

    await removeAccountOTP(ctx)({
      accountId: ctx.params.id,
      bindingCode,
    });

    ctx.body = {};
    ctx.status = HttpStatus.Success.NO_CONTENT;
  },
);

router.patch(
  "/:id/permission",
  async (ctx: IAuthContext): Promise<void> => {
    const { permission } = ctx.request.body;

    await updateAccountPermission(ctx)({
      accountId: ctx.params.id,
      permission,
    });

    ctx.body = {};
    ctx.status = HttpStatus.Success.NO_CONTENT;
  },
);

router.patch(
  "/email",
  async (ctx: IAuthContext): Promise<void> => {
    const { updatedEmail } = ctx.request.body;

    await updateAccountEmail(ctx)({
      updatedEmail,
    });

    ctx.body = {};
    ctx.status = HttpStatus.Success.NO_CONTENT;
  },
);

router.post(
  "/otp",
  async (ctx: IAuthContext): Promise<void> => {
    ctx.body = await addAccountOTP(ctx)();

    ctx.status = HttpStatus.Success.OK;
  },
);

router.put(
  "/password",
  async (ctx: IAuthContext): Promise<void> => {
    const { password, updatedPassword } = ctx.request.body;

    await updateAccountPassword(ctx)({
      password,
      updatedPassword,
    });

    ctx.body = {};
    ctx.status = HttpStatus.Success.NO_CONTENT;
  },
);
