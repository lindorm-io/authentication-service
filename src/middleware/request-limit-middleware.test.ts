import MockDate from "mockdate";
import { AssertCodeChallengeError, RequestLimitFailedTryError } from "../error";
import { GrantType } from "../enum";
import { RequestLimit } from "../entity";
import { createOrUpdateRequestLimit, validateRequestLimitBackOff } from "../support";
import { getTestCache, inMemoryCache, logger, resetCache } from "../test";
import { requestLimitMiddleware } from "./request-limit-middleware";

jest.mock("uuid", () => ({
  v4: jest.fn(() => "be3a62d1-24a0-401c-96dd-3aff95356811"),
}));
jest.mock("../support", () => ({
  createOrUpdateRequestLimit: jest.fn(() => () => {}),
  validateRequestLimitBackOff: jest.fn(() => () => {}),
}));

MockDate.set("2020-01-01 08:00:00.000");

const next = jest.fn();

describe("requestLimitMiddleware", () => {
  let ctx: any;

  beforeEach(async () => {
    ctx = {
      cache: await getTestCache(),
      logger,
      request: {
        body: {
          grantType: GrantType.DEVICE_PIN,
          subject: "subject@lindorm.io",
        },
      },
    };
  });

  afterEach(() => {
    jest.clearAllMocks();
    resetCache();
  });

  test("should consider request rate limited", async () => {
    await ctx.cache.requestLimit.create(
      new RequestLimit({
        grantType: GrantType.DEVICE_PIN,
        subject: "subject@lindorm.io",
      }),
    );

    await expect(requestLimitMiddleware(ctx, next)).resolves.toBe(undefined);

    expect(ctx.requestLimit).toMatchSnapshot();
    expect(inMemoryCache).toMatchSnapshot();

    expect(validateRequestLimitBackOff).toHaveBeenCalled();
    expect(createOrUpdateRequestLimit).not.toHaveBeenCalled();
  });

  test("should consider request clean", async () => {
    await expect(requestLimitMiddleware(ctx, next)).resolves.toBe(undefined);

    expect(ctx.requestLimit).toMatchSnapshot();
    expect(inMemoryCache).toMatchSnapshot();

    expect(validateRequestLimitBackOff).not.toHaveBeenCalled();
  });

  test("should create or update request limit", async () => {
    next.mockImplementation(() => {
      throw new AssertCodeChallengeError("string", "verifier");
    });

    await expect(requestLimitMiddleware(ctx, next)).rejects.toThrow(expect.any(RequestLimitFailedTryError));

    expect(createOrUpdateRequestLimit).toHaveBeenCalled();
  });
});
