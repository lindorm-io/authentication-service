import { assertValidResponseTypeInput, isResponseType } from "./response-type";
import { ResponseType } from "../enum";
import { APIError } from "@lindorm-io/errors";

describe("assertResponseType", () => {
  test("should succeed on ACCESS", () => {
    expect(assertValidResponseTypeInput(ResponseType.ACCESS)).toBe(undefined);
  });

  test("should succeed on IDENTITY", () => {
    expect(assertValidResponseTypeInput(ResponseType.IDENTITY)).toBe(undefined);
  });

  test("should succeed on REFRESH", () => {
    expect(assertValidResponseTypeInput(ResponseType.REFRESH)).toBe(undefined);
  });

  test("should succeed on all response types", () => {
    expect(
      assertValidResponseTypeInput(`${ResponseType.ACCESS} ${ResponseType.IDENTITY} ${ResponseType.REFRESH}`),
    ).toBe(undefined);
  });

  test("should throw an error when an invalid type is provided", () => {
    expect(() => assertValidResponseTypeInput("wrong")).toThrow(expect.any(APIError));
  });
});

describe("isResponseType", () => {
  test("should return true on ACCESS", () => {
    expect(isResponseType("token", ResponseType.ACCESS)).toBe(true);
    expect(isResponseType("id_token", ResponseType.ACCESS)).toBe(false);
    expect(isResponseType("code", ResponseType.ACCESS)).toBe(false);
  });

  test("should return true on IDENTITY", () => {
    expect(isResponseType("token", ResponseType.IDENTITY)).toBe(false);
    expect(isResponseType("id_token", ResponseType.IDENTITY)).toBe(true);
    expect(isResponseType("code", ResponseType.IDENTITY)).toBe(false);
  });

  test("should return true on REFRESH", () => {
    expect(isResponseType("token", ResponseType.REFRESH)).toBe(false);
    expect(isResponseType("id_token", ResponseType.REFRESH)).toBe(false);
    expect(isResponseType("code", ResponseType.REFRESH)).toBe(true);
  });

  test("should return true on all response types", () => {
    expect(isResponseType("token id_token code", ResponseType.ACCESS)).toBe(true);
    expect(isResponseType("token id_token code", ResponseType.IDENTITY)).toBe(true);
    expect(isResponseType("token id_token code", ResponseType.REFRESH)).toBe(true);
  });

  test("should return false when an invalid type is provided", () => {
    expect(isResponseType("wrong", ResponseType.REFRESH)).toBe(false);
    expect(isResponseType("wrong", ResponseType.REFRESH)).toBe(false);
    expect(isResponseType("wrong", ResponseType.REFRESH)).toBe(false);
  });
});
