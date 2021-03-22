import MockDate from "mockdate";
import { ExpiredSessionError } from "../../error";
import { JWT_AUTHORIZATION_TOKEN_EXPIRY, JWT_REFRESH_TOKEN_EXPIRY } from "../../config";
import { Session } from "../../entity";
import { assertSessionIsNotExpired, getSessionExpires } from "./expires";
import { getTestAccount, getTestClient, getTestSession } from "../../test";

jest.mock("uuid", () => ({
  v4: jest.fn(() => "be3a62d1-24a0-401c-96dd-3aff95356811"),
}));
jest.mock("../../config", () => ({
  ...jest.requireActual("../../config"),
  JWT_AUTHORIZATION_TOKEN_EXPIRY: "15 minutes",
  JWT_REFRESH_TOKEN_EXPIRY: "14 days",
}));

MockDate.set("2020-01-01 08:00:00.000");

describe("getSessionExpires", () => {
  test("should return a modified date for authorization token", () => {
    expect(getSessionExpires(JWT_AUTHORIZATION_TOKEN_EXPIRY)).toStrictEqual(new Date("2020-01-01T07:15:00.000Z"));
  });

  test("should return a modified date for refresh token", () => {
    expect(getSessionExpires(JWT_REFRESH_TOKEN_EXPIRY)).toStrictEqual(new Date("2020-01-15T07:00:00.000Z"));
  });
});

describe("assertSessionIsNotExpired", () => {
  let session: Session;

  beforeEach(() => {
    session = getTestSession(
      getTestAccount("email@lindorm.io"),
      getTestClient(),
      "H4LnTn7e1DltMsohJgIeKSNgpvppJ1qP6QRRD9Ai1pw=",
      "sha256",
    );
  });

  test("should succeed when date is before", () => {
    expect(assertSessionIsNotExpired(session)).toBe(undefined);
  });

  test("should throw error when date is after", () => {
    session.expires = new Date("2000-01-01 01:00:00.000");
    expect(() => assertSessionIsNotExpired(session)).toThrow(expect.any(ExpiredSessionError));
  });
});
