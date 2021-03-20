import { isScope, Scope } from "@lindorm-io/jwt";
import { IKoaAuthContext } from "../../typing";
import { InvalidScopeError } from "../../error";

export const assertBearerTokenScope = (ctx: IKoaAuthContext) => (expectedScopes: Array<Scope>): void => {
  const {
    token: {
      bearer: { scope },
    },
  } = ctx;

  for (const expect of expectedScopes) {
    if (isScope(scope, expect)) continue;
    throw new InvalidScopeError(scope, Scope.DEFAULT);
  }
};
