import { mockCacheRequestLimit } from "../test/mocks/cache";
import { RequestLimit } from "../entity";
import { GrantType } from "../enum";
import { requestLimitSuccessMiddleware } from "./request-limit-success-middleware";
import MockDate from "mockdate";

jest.mock("uuid", () => ({
  v4: jest.fn(() => "e3926ddb-ecaf-4f66-855a-d143af54953c"),
}));

MockDate.set("2020-01-01T07:00:00.000Z");
const date = new Date("2020-01-01T07:00:00.000Z");

describe("requestLimitSuccessMiddleware", () => {
  let ctx: any;
  let next: any;

  beforeEach(() => {
    ctx = {
      cache: {
        requestLimit: mockCacheRequestLimit,
      },
      requestLimit: new RequestLimit({
        grantType: GrantType.DEVICE_PIN,
        subject: "subject@lindorm.io",
      }),
    };
    next = () => Promise.resolve();
  });

  afterEach(jest.resetAllMocks);

  test("should clear limit on successful request", async () => {
    await expect(requestLimitSuccessMiddleware(ctx, next)).resolves.toBe(undefined);

    expect(ctx.cache.requestLimit.remove).toHaveBeenCalledWith({
      _backOffUntil: null,
      _created: date,
      _events: [],
      _failedTries: 1,
      _grantType: "pin_code",
      _id: "e3926ddb-ecaf-4f66-855a-d143af54953c",
      _subject: "subject@lindorm.io",
      _updated: date,
      _version: 0,
    });
  });

  test("should only clear existing limits", async () => {
    ctx.requestLimit = undefined;

    await expect(requestLimitSuccessMiddleware(ctx, next)).resolves.toBe(undefined);

    expect(ctx.cache.requestLimit.remove).not.toHaveBeenCalled();
  });
});
