import { encryptClientSecret } from "./client-secret";

describe("encryptClientSecret", () => {
  test("should resolve", () => {
    expect(encryptClientSecret("secret")).not.toBe("secret");
  });
});
