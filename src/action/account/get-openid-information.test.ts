import MockDate from "mockdate";
import { Account } from "../../entity";
import { MOCK_ACCOUNT_OPTIONS } from "../../test/mocks";
import { MOCK_LOGGER } from "../../test/mocks";
import { getOpenIdInformation } from "./get-openid-information";

jest.mock("uuid", () => ({
  v4: jest.fn(() => "be3a62d1-24a0-401c-96dd-3aff95356811"),
}));
jest.mock("../../support", () => ({
  assertBearerTokenScope: jest.fn(() => () => undefined),
}));

MockDate.set("2020-01-01 08:00:00.000");

describe("getOpenIdInformation", () => {
  let getMockContext: any;

  beforeEach(() => {
    getMockContext = () => ({
      account: new Account(MOCK_ACCOUNT_OPTIONS),
      logger: MOCK_LOGGER,
    });
  });

  test("should return openid information", async () => {
    await expect(getOpenIdInformation(getMockContext())()).resolves.toStrictEqual({
      email: "email@lindorm.io",
      emailVerified: true,
      sub: "be3a62d1-24a0-401c-96dd-3aff95356811",
      updatedAt: 1577862000,
    });
  });
});
