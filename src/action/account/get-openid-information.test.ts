import MockDate from "mockdate";
import { getOpenIdInformation } from "./get-openid-information";
import { getTestAccount, logger } from "../../test";

jest.mock("uuid", () => ({
  v4: jest.fn(() => "be3a62d1-24a0-401c-96dd-3aff95356811"),
}));
jest.mock("../../support", () => ({
  assertBearerTokenScope: jest.fn(() => () => undefined),
}));

MockDate.set("2020-01-01 08:00:00.000");

describe("getOpenIdInformation", () => {
  let ctx: any;

  beforeEach(() => {
    ctx = {
      account: getTestAccount("email@lindorm.io"),
      logger,
    };
  });

  test("should return openid information", async () => {
    await expect(getOpenIdInformation(ctx)()).resolves.toMatchSnapshot();
  });
});
