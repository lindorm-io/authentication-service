import { InvalidScopeInputError } from "../error";
import { isValidScope } from "@lindorm-io/jwt";

export const assertValidScopeInput = (scope: string): void => {
  if (isValidScope(scope)) return;
  throw new InvalidScopeInputError(scope);
};
