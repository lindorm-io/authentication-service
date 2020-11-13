import { validateRequestLimitBackOff } from "./validate-back-off";
import MockDate from "mockdate";
import { RequestLimit } from "../../entity";
import { GrantType } from "../../enum";

jest.mock("uuid", () => ({
  v4: jest.fn(() => "addde23d-83fe-46bf-a32f-dbc77efa0484"),
}));

MockDate.set("2020-01-01T08:00:00.000Z");

describe("validateRequestLimitBackOff", () => {
  const ctx: any = {};

  test("should resolve when there is no requestLimit", () => {
    expect(validateRequestLimitBackOff(ctx)()).toBe(undefined);
  });

  test("should resolve when backOffUntil has been passed", () => {
    ctx.requestLimit = new RequestLimit({
      subject: "test@lindorm.io",
      grantType: GrantType.DEVICE_PIN,
      backOffUntil: new Date("2020-01-01T07:00:00.000Z"),
    });

    expect(validateRequestLimitBackOff(ctx)()).toBe(undefined);
  });

  test("should throw when backOffUntil is still in effect", () => {
    ctx.requestLimit = new RequestLimit({
      subject: "test@lindorm.io",
      grantType: GrantType.DEVICE_PIN,
      backOffUntil: new Date("2020-01-01T09:00:00.000Z"),
    });

    expect(() => validateRequestLimitBackOff(ctx)()).toThrow();
  });
});
