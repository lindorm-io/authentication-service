import MockDate from "mockdate";
import { Account } from "../../entity";
import { Permission } from "@lindorm-io/jwt";
import { getMockRepository, MOCK_ACCOUNT_OPTIONS, MOCK_LOGGER, MOCK_UUID } from "../../test/mocks";
import { updateAccountPermission } from "./update-permission";

jest.mock("uuid", () => ({
  v4: jest.fn(() => "be3a62d1-24a0-401c-96dd-3aff95356811"),
}));
jest.mock("../../support", () => ({
  assertAccountAdmin: jest.fn(() => () => undefined),
}));

MockDate.set("2020-01-01 08:00:00.000");
const date = new Date("2020-01-01 08:00:00.000");

describe("updateAccountPermission", () => {
  let getMockContext: any;

  beforeEach(() => {
    getMockContext = () => ({
      account: new Account(MOCK_ACCOUNT_OPTIONS),
      logger: MOCK_LOGGER,
      repository: getMockRepository(),
    });
  });

  test("should update account permission", async () => {
    const ctx = getMockContext();

    await expect(
      updateAccountPermission(ctx)({
        accountId: MOCK_UUID,
        permission: Permission.LOCKED,
      }),
    ).resolves.toBe(undefined);

    expect(ctx.repository.account.update).toHaveBeenCalledWith({
      _created: date,
      _email: "email@lindorm.io",
      _events: [
        {
          date: date,
          name: "account_permission_changed",
          payload: {
            permission: Permission.LOCKED,
          },
        },
      ],
      _id: MOCK_UUID,
      _identityLinked: false,
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
