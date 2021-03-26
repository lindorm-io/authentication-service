import { assertValidScopeInput } from "./assert-valid-scope-input";
import { Scope } from "@lindorm-io/jwt";
import { InvalidScopeInputError } from "../error";

describe("assertValidScopeInput", () => {
  test("should resolve undefined on valid scope input", () => {
    expect(assertValidScopeInput([Scope.DEFAULT, Scope.EDIT, Scope.OPENID, Scope.BIRTH_DATE])).toBe(undefined);
  });

  test("should throw error when scope is unexpected", () => {
    expect(() => assertValidScopeInput(["default", "edit", "wrong"])).toThrow(expect.any(InvalidScopeInputError));
  });
});
