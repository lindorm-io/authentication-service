import { Client } from "../../entity";
import { MOCK_CLIENT_OPTIONS } from "../../test/mocks/repository";
import { assertClientSecret, encryptClientSecret } from "./client-secret";

describe("encryptClientSecret", () => {
  test("should resolve", () => {
    expect(encryptClientSecret("secret")).not.toBe("secret");
  });
});

describe("assertClientSecret", () => {
  test("should resolve", () => {
    const client = new Client({
      ...MOCK_CLIENT_OPTIONS,
      secret: encryptClientSecret("secret"),
    });
    expect(assertClientSecret(client, "secret")).toBe(undefined);
  });
});
