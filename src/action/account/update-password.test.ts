import MockDate from "mockdate";
import { Account } from "../../entity";
import { MOCK_LOGGER } from "../../test/mocks";
import { getMockRepository, MOCK_ACCOUNT_OPTIONS } from "../../test/mocks";
import { updateAccountPassword } from "./update-password";

jest.mock("uuid", () => ({
  v4: jest.fn(() => "be3a62d1-24a0-401c-96dd-3aff95356811"),
}));
jest.mock("../../support", () => ({
  assertAccountPassword: jest.fn(() => undefined),
  assertBearerTokenScope: jest.fn(() => () => undefined),
  encryptAccountPassword: jest.fn(() => "encryptAccountPassword"),
}));

MockDate.set("2020-01-01 08:00:00.000");
const date = new Date("2020-01-01 08:00:00.000");

describe("updateAccountPassword", () => {
  let getMockContext: any;

  beforeEach(() => {
    getMockContext = () => ({
      account: new Account(MOCK_ACCOUNT_OPTIONS),
      logger: MOCK_LOGGER,
      repository: getMockRepository(),
    });
  });

  test("should update account otp", async () => {
    const ctx = getMockContext();

    await expect(
      updateAccountPassword(ctx)({
        password: "password",
        updatedPassword: "updatedPassword",
      }),
    ).resolves.toBe(undefined);

    expect(ctx.repository.account.update).toHaveBeenCalledWith({
      _created: date,
      _email: "email@lindorm.io",
      _events: [
        {
          date: date,
          name: "account_password_changed",
          payload: {
            password: {
              signature: "encryptAccountPassword",
              updated: date,
            },
          },
        },
      ],
      _id: "be3a62d1-24a0-401c-96dd-3aff95356811",
      _identityId: null,
      _otp: {
        signature: null,
        uri: null,
      },
      _password: {
        signature: "encryptAccountPassword",
        updated: date,
      },
      _permission: "user",
      _updated: date,
      _version: 0,
    });
  });
});
