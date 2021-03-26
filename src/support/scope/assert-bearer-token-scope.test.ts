import { Scope } from "@lindorm-io/jwt";
import { assertBearerTokenScope } from "./assert-bearer-token-scope";
import { InvalidScopeError } from "../../error";

describe("assertBearerTokenScope", () => {
  test("should resolve true when scope exists", () => {
    const ctx: any = {
      token: {
        bearer: {
          scope: [Scope.DEFAULT, Scope.EDIT, Scope.OPENID],
        },
      },
    };

    expect(assertBearerTokenScope(ctx)([Scope.DEFAULT, Scope.OPENID])).toBe(undefined);
  });

  test("should throw error when scope is missing", () => {
    const ctx: any = {
      token: {
        bearer: {
          scope: [Scope.DEFAULT, Scope.EDIT, Scope.OPENID].join(" "),
        },
      },
    };

    expect(() => assertBearerTokenScope(ctx)([Scope.DEFAULT, Scope.BIRTH_DATE])).toThrow(expect.any(InvalidScopeError));
  });
});
