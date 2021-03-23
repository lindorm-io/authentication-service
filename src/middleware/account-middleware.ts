import { IKoaAuthContext, TNext } from "../typing";
import { InvalidPermissionError, InvalidScopeError, LockedAccountError } from "../error";
import { Scope, isLocked, isScope } from "@lindorm-io/jwt";

export const accountMiddleware = async (ctx: IKoaAuthContext, next: TNext): Promise<void> => {
  const start = Date.now();

  const { logger, repository, token } = ctx;
  const { subject, permission, scope } = token.bearer;

  const account = await repository.account.find({ id: subject });

  if (isLocked(account.permission)) {
    throw new LockedAccountError(account.id);
  }

  if (account.permission !== permission) {
    throw new InvalidPermissionError();
  }

  if (!isScope(scope, Scope.DEFAULT)) {
    throw new InvalidScopeError(scope, Scope.DEFAULT);
  }

  logger.debug("account found", { id: account.id });

  ctx.account = account;
  ctx.metrics = {
    ...(ctx.metrics || {}),
    account: Date.now() - start,
  };

  await next();
};
