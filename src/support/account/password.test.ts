import { assertAccountPassword, encryptAccountPassword } from "./password";
import { getTestAccountWithPassword } from "../../test";

describe("encryptAccountPassword", () => {
  test("should resolve", async () => {
    await expect(encryptAccountPassword("password")).resolves.not.toBe("password");
  });
});

describe("assertAccountPassword", () => {
  test("should resolve", async () => {
    const account = await getTestAccountWithPassword("email@lindorm.io");

    await expect(assertAccountPassword(account, "test_account_password")).resolves.toBe(undefined);
  });
});
