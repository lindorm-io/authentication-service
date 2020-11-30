import MockDate from "mockdate";
import { Account } from "./Account";

jest.mock("uuid", () => ({
  v4: jest.fn(() => "be3a62d1-24a0-401c-96dd-3aff95356811"),
}));

MockDate.set("2020-01-01 08:00:00.000");
const date = new Date("2020-01-01 08:00:00.000");

describe("Account.ts", () => {
  let account: Account;

  beforeEach(() => {
    account = new Account({
      email: "email@lindorm.io",
      identityId: "1148b4d6-214b-4bc3-9611-feecc065bf3c",
      otp: { signature: "signature", uri: "uri" },
      password: { signature: "password", updated: date },
      permission: "permission",
    });
  });

  test("should have all data", () => {
    expect(account).toMatchSnapshot();
  });

  test("should have optional data", () => {
    account = new Account({
      email: "email@lindorm.io",
    });

    expect(account).toMatchSnapshot();
  });

  test("should create", () => {
    account.create();
    expect(account.events).toMatchSnapshot();
  });

  test("should always cast email as lowercase", () => {
    account = new Account({
      email: "EMAIL@LINDORM.IO",
    });
    expect(account).toMatchSnapshot();
  });

  test("should get/set email as lowercase", () => {
    expect(account.email).toBe("email@lindorm.io");

    account.email = "NEW-email@lindorm.io";

    expect(account.email).toBe("new-email@lindorm.io");
    expect(account.events).toMatchSnapshot();
  });

  test("should get/set identityId", () => {
    expect(account.identityId).toBe("1148b4d6-214b-4bc3-9611-feecc065bf3c");

    account.identityId = "ca02be54-0b11-4d45-b918-f637c3162517";

    expect(account.identityId).toBe("ca02be54-0b11-4d45-b918-f637c3162517");
    expect(account.events).toMatchSnapshot();
  });

  test("should get/set otp", () => {
    expect(account.otp).toStrictEqual({ signature: "signature", uri: "uri" });

    account.otp = { signature: "new-signature", uri: "new-uri" };

    expect(account.otp).toStrictEqual({ signature: "new-signature", uri: "new-uri" });
    expect(account.events).toMatchSnapshot();
  });

  test("should get/set password", () => {
    expect(account.password).toStrictEqual({ signature: "password", updated: date });

    account.password = { signature: "new-password", updated: date };

    expect(account.password).toStrictEqual({ signature: "new-password", updated: date });
    expect(account.events).toMatchSnapshot();
  });

  test("should get/set permission", () => {
    expect(account.permission).toBe("permission");

    account.permission = "new-permission";

    expect(account.permission).toBe("new-permission");
    expect(account.events).toMatchSnapshot();
  });
});
