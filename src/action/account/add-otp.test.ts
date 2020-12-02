import MockDate from "mockdate";
import { Account } from "../../entity";
import { MOCK_LOGGER } from "../../test/mocks";
import { addAccountOTP } from "./add-otp";
import { getMockRepository, MOCK_ACCOUNT_OPTIONS } from "../../test/mocks";

jest.mock("uuid", () => ({
  v4: jest.fn(() => "be3a62d1-24a0-401c-96dd-3aff95356811"),
}));
jest.mock("../../support", () => ({
  assertBearerTokenScope: jest.fn(() => () => undefined),
  generateAccountOTP: jest.fn(() => ({ signature: "signature", uri: "uri" })),
}));

MockDate.set("2020-01-01 08:00:00.000");
const date = new Date("2020-01-01 08:00:00.000");

describe("addAccountOTP", () => {
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

    await expect(addAccountOTP(ctx)()).resolves.toMatchSnapshot();

    expect(ctx.repository.account.update).toHaveBeenCalledWith({
      _created: date,
      _email: "email@lindorm.io",
      _events: [
        {
          date: date,
          name: "account_otp_changed",
          payload: {
            otp: {
              signature: "signature",
              uri: "uri",
            },
          },
        },
      ],
      _id: "be3a62d1-24a0-401c-96dd-3aff95356811",
      _identityId: null,
      _otp: { signature: "signature", uri: "uri" },
      _password: { signature: null, updated: null },
      _permission: "user",
      _updated: date,
      _version: 0,
    });
  });
});
