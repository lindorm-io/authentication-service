import MockDate from "mockdate";
import { AssertCodeChallengeError } from "../../error";
import { MOCK_CODE_VERIFIER, MOCK_SESSION_OPTIONS } from "../../test/mocks";
import { Session } from "../../entity";
import { assertCodeChallenge } from "./challenge";

jest.mock("uuid", () => ({
  v4: jest.fn(() => "be3a62d1-24a0-401c-96dd-3aff95356811"),
}));

MockDate.set("2020-01-01 08:00:00.000");

describe("assertCodeChallenge", () => {
  let session: Session;

  beforeEach(() => {
    session = new Session(MOCK_SESSION_OPTIONS);
  });

  test("should assert code challenge", () => {
    expect(assertCodeChallenge(session, MOCK_CODE_VERIFIER)).toBe(undefined);
  });

  test("should throw error", () => {
    expect(() => assertCodeChallenge(session, "wrong")).toThrow(expect.any(AssertCodeChallengeError));
  });
});
