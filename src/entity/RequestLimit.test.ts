import MockDate from "mockdate";
import { RequestLimit } from "./RequestLimit";
import { GrantType } from "../enum";

jest.mock("uuid", () => ({
  v4: jest.fn(() => "be3a62d1-24a0-401c-96dd-3aff95356811"),
}));

MockDate.set("2020-01-01 08:00:00.000");
const date = new Date("2020-01-01 08:00:00.000");

describe("Session.ts", () => {
  let requestLimit: RequestLimit;

  beforeEach(() => {
    requestLimit = new RequestLimit({
      backOffUntil: new Date(),
      failedTries: 5,
      grantType: GrantType.DEVICE_PIN,
      subject: "test@lindorm.io",
    });
  });

  test("should have all data", () => {
    expect(requestLimit).toMatchSnapshot();
  });

  test("should have optional data", () => {
    requestLimit = new RequestLimit({
      grantType: GrantType.DEVICE_PIN,
      subject: "test@lindorm.io",
    });

    expect(requestLimit).toMatchSnapshot();
  });

  test("should get/set backOffUntil", () => {
    expect(requestLimit.backOffUntil).toStrictEqual(date);

    requestLimit.backOffUntil = new Date("2020-01-01 10:00:00.000");

    expect(requestLimit.backOffUntil).toStrictEqual(new Date("2020-01-01 10:00:00.000"));
  });

  test("should get/set failedTries", () => {
    expect(requestLimit.failedTries).toBe(5);

    requestLimit.failedTries = 100;

    expect(requestLimit.failedTries).toBe(100);
  });

  test("should get grantType", () => {
    expect(requestLimit.grantType).toMatchSnapshot();
  });

  test("should get subject", () => {
    expect(requestLimit.grantType).toMatchSnapshot();
  });
});
