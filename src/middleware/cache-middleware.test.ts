import { MOCK_LOGGER } from "../test/mocks";
import { RequestLimitCache } from "../cache/request-limit";
import { cacheMiddleware } from "./cache-middleware";

describe("cacheMiddleware", () => {
  let ctx: any;
  let next: any;

  beforeEach(() => {
    ctx = {
      logger: MOCK_LOGGER,
      redis: {
        getClient: jest.fn(() => "client"),
      },
    };
    next = () => Promise.resolve();
  });

  test("should successfully set cache on ctx", async () => {
    await expect(cacheMiddleware(ctx, next)).resolves.toBe(undefined);

    expect(ctx.cache.requestLimit).toStrictEqual(expect.any(RequestLimitCache));
    expect(ctx.metrics.cache).toStrictEqual(expect.any(Number));
  });
});
