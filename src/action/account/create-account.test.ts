import { Account } from "../../entity";
import { MOCK_LOGGER } from "../../test/mocks";
import { Permission } from "@lindorm-io/jwt";
import { createAccount } from "./create-account";
import { getMockRepository, MOCK_ACCOUNT_OPTIONS } from "../../test/mocks";
import MockDate from "mockdate";

jest.mock("uuid", () => ({
  v4: jest.fn(() => "be3a62d1-24a0-401c-96dd-3aff95356811"),
}));
jest.mock("../../support", () => ({
  assertAccountAdmin: jest.fn(() => () => undefined),
}));

MockDate.set("2020-01-01 08:00:00.000");
const date = new Date("2020-01-01 08:00:00.000");

describe("createAccount", () => {
  let getMockContext: any;

  beforeEach(() => {
    getMockContext = () => ({
      account: new Account(MOCK_ACCOUNT_OPTIONS),
      logger: MOCK_LOGGER,
      repository: getMockRepository(),
    });
  });

  test("should remove account", async () => {
    const ctx = getMockContext();

    await expect(
      createAccount(ctx)({
        email: "lindorm@lindorm.io",
        permission: Permission.LOCKED,
      }),
    ).resolves.toStrictEqual({ accountId: "be3a62d1-24a0-401c-96dd-3aff95356811" });

    expect(ctx.repository.account.create).toHaveBeenCalledWith({
      _created: date,
      _email: "lindorm@lindorm.io",
      _events: [],
      _id: "be3a62d1-24a0-401c-96dd-3aff95356811",
      _identityId: null,
      _otp: {
        signature: null,
        uri: null,
      },
      _password: {
        signature: null,
        updated: null,
      },
      _permission: Permission.LOCKED,
      _updated: date,
      _version: 0,
    });
  });
});
