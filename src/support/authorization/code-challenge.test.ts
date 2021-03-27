import MockDate from "mockdate";
import { AssertCodeChallengeError } from "../../error";
import { Authorization } from "../../entity";
import { assertCodeChallenge } from "./code-challenge";
import { getTestAuthorization } from "../../test";

jest.mock("uuid", () => ({
  v4: jest.fn(() => "be3a62d1-24a0-401c-96dd-3aff95356811"),
}));

MockDate.set("2020-01-01 08:00:00.000");

describe("assertCodeChallenge", () => {
  let authorization: Authorization;

  beforeEach(() => {
    authorization = getTestAuthorization({});
  });

  test("should assert code challenge", () => {
    expect(assertCodeChallenge(authorization, "MHNnb24yMzBqZ2hvNDJuMDI5ajAyNGdt")).toBe(undefined);
  });

  test("should throw error", () => {
    expect(() => assertCodeChallenge(authorization, "wrong")).toThrow(expect.any(AssertCodeChallengeError));
  });
});
