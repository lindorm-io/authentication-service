import { IAuthContext } from "../typing";
import { InvalidPermissionError, LockedAccountError } from "../error";
import { Permission, Scope } from "../enum";
import { TPromise } from "@lindorm-io/core";
import { includes } from "lodash";

export const accountMiddleware = async (ctx: IAuthContext, next: TPromise<void>): Promise<void> => {
  const start = Date.now();

  const { logger, repository, token } = ctx;
  const { subject, permission, scope } = token.bearer;

  const account = await repository.account.find({ id: subject });

  if (account.permission === Permission.LOCKED) {
    throw new LockedAccountError(account.id);
  }

  if (account.permission !== permission) {
    throw new InvalidPermissionError();
  }

  const scopes = scope.split(" ");

  if (!includes(scopes, Scope.DEFAULT)) {
    throw new Error("invalid scope");
  }

  logger.debug("account found", { id: account.id });

  ctx.account = account;
  ctx.metrics = {
    ...(ctx.metrics || {}),
    account: Date.now() - start,
  };

  await next();
};
