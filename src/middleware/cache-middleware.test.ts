import { AuthorizationCache, RequestLimitCache } from "../infrastructure";
import { cacheMiddleware } from "./cache-middleware";
import { logger } from "../test";
import { getTestRedis } from "../test/grey-box/test-redis";

const next = jest.fn();

describe("cacheMiddleware", () => {
  let ctx: any;

  beforeEach(async () => {
    ctx = {
      logger,
      redis: await getTestRedis(),
    };
  });

  test("should successfully set cache on ctx", async () => {
    await expect(cacheMiddleware(ctx, next)).resolves.toBe(undefined);

    expect(ctx.cache.authorization).toStrictEqual(expect.any(AuthorizationCache));
    expect(ctx.cache.requestLimit).toStrictEqual(expect.any(RequestLimitCache));
  });
});
