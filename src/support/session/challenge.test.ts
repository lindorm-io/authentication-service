import MockDate from "mockdate";
import { AssertCodeChallengeError } from "../../error";
import { Session } from "../../entity";
import { assertCodeChallenge } from "./challenge";
import { getTestAccount, getTestClient, getTestSession } from "../../test";

jest.mock("uuid", () => ({
  v4: jest.fn(() => "be3a62d1-24a0-401c-96dd-3aff95356811"),
}));

MockDate.set("2020-01-01 08:00:00.000");

describe("assertCodeChallenge", () => {
  let session: Session;

  beforeEach(() => {
    session = getTestSession(
      getTestAccount("email@lindorm.io"),
      getTestClient(),
      "H4LnTn7e1DltMsohJgIeKSNgpvppJ1qP6QRRD9Ai1pw=",
      "sha256",
    );
  });

  test("should assert code challenge", () => {
    expect(assertCodeChallenge(session, "MHNnb24yMzBqZ2hvNDJuMDI5ajAyNGdt")).toBe(undefined);
  });

  test("should throw error", () => {
    expect(() => assertCodeChallenge(session, "wrong")).toThrow(expect.any(AssertCodeChallengeError));
  });
});
