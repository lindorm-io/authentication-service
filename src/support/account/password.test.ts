import { assertAccountPassword, encryptAccountPassword } from "./password";
import { Account } from "../../entity";
import { MOCK_ACCOUNT_OPTIONS } from "../../test/mocks/repository";

describe("encryptAccountPassword", () => {
  test("should resolve", async () => {
    await expect(encryptAccountPassword("password")).resolves.not.toBe("password");
  });
});

describe("assertAccountPassword", () => {
  test("should resolve", async () => {
    const account = new Account({
      ...MOCK_ACCOUNT_OPTIONS,
      password: {
        signature: await encryptAccountPassword("password"),
        updated: new Date(),
      },
    });
    await expect(assertAccountPassword(account, "password")).resolves.toBe(undefined);
  });
});
