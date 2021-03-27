import MockDate from "mockdate";
import { ExpiredSessionError } from "../../error";
import { assertSessionIsNotExpired } from "./expires";
import { getTestSession } from "../../test";

jest.mock("uuid", () => ({
  v4: jest.fn(() => "be3a62d1-24a0-401c-96dd-3aff95356811"),
}));

MockDate.set("2020-01-01 08:00:00.000");

describe("assertSessionIsNotExpired", () => {
  test("should succeed when date is before", () => {
    expect(assertSessionIsNotExpired(getTestSession({}))).toBe(undefined);
  });

  test("should throw error when date is after", () => {
    expect(() =>
      assertSessionIsNotExpired(
        getTestSession({
          expires: new Date("2000-01-01 01:00:00.000"),
        }),
      ),
    ).toThrow(expect.any(ExpiredSessionError));
  });
});
