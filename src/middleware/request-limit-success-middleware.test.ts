import MockDate from "mockdate";
import { GrantType } from "../enum";
import { RequestLimit } from "../entity";
import { getTestCache, inMemoryCache, resetCache } from "../test";
import { requestLimitSuccessMiddleware } from "./request-limit-success-middleware";

jest.mock("uuid", () => ({
  v4: jest.fn(() => "e3926ddb-ecaf-4f66-855a-d143af54953c"),
}));

MockDate.set("2020-01-01T07:00:00.000Z");

const next = jest.fn();

describe("requestLimitSuccessMiddleware", () => {
  let ctx: any;

  beforeEach(async () => {
    ctx = {
      cache: await getTestCache(),
      requestLimit: new RequestLimit({
        grantType: GrantType.DEVICE_PIN,
        subject: "subject@lindorm.io",
      }),
    };

    await ctx.cache.requestLimit.create(ctx.requestLimit);
    await ctx.cache.requestLimit.create(
      new RequestLimit({
        grantType: GrantType.EMAIL_LINK,
        subject: "other@lindorm.io",
      }),
    );
  });

  afterEach(() => {
    jest.clearAllMocks();
    resetCache();
  });

  test("should clear limit on successful request", async () => {
    await expect(requestLimitSuccessMiddleware(ctx, next)).resolves.toBe(undefined);

    expect(inMemoryCache).toMatchSnapshot();
  });

  test("should only clear existing limits", async () => {
    ctx.requestLimit = undefined;

    await expect(requestLimitSuccessMiddleware(ctx, next)).resolves.toBe(undefined);
  });
});
