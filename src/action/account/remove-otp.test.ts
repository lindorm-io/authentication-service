import MockDate from "mockdate";
import { Account } from "../../entity";
import { MOCK_LOGGER, MOCK_UUID } from "../../test/mocks";
import { getMockRepository, MOCK_ACCOUNT_OPTIONS } from "../../test/mocks";
import { removeAccountOTP } from "./remove-otp";

jest.mock("uuid", () => ({
  v4: jest.fn(() => "be3a62d1-24a0-401c-96dd-3aff95356811"),
}));
jest.mock("../../support", () => ({
  assertAccountOTP: jest.fn(() => undefined),
  assertBearerTokenScope: jest.fn(() => () => undefined),
  getAccount: jest.fn(() => () => new Account(MOCK_ACCOUNT_OPTIONS)),
}));

MockDate.set("2020-01-01 08:00:00.000");
const date = new Date("2020-01-01 08:00:00.000");

describe("removeAccountOTP", () => {
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
      removeAccountOTP(ctx)({
        accountId: MOCK_UUID,
        bindingCode: "123456",
      }),
    ).resolves.toBe(undefined);

    expect(ctx.repository.account.update).toHaveBeenCalledWith({
      _created: date,
      _email: "email@lindorm.io",
      _events: [{ date: date, name: "account_otp_changed", payload: { otp: { signature: null, uri: null } } }],
      _id: "be3a62d1-24a0-401c-96dd-3aff95356811",
      _identityId: null,
      _otp: { signature: null, uri: null },
      _password: { signature: null, updated: null },
      _permission: "user",
      _updated: date,
      _version: 0,
    });
  });
});
