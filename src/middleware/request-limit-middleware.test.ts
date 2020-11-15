import * as create from "../support/request-limit/create-or-update-request-limit";
import * as validate from "../support/request-limit/validate-back-off";
import MockDate from "mockdate";
import { GrantType } from "../enum";
import { MOCK_LOGGER, mockCacheRequestLimit } from "../test/mocks";
import { requestLimitMiddleware } from "./request-limit-middleware";
import { CacheEntityNotFoundError } from "@lindorm-io/redis/dist/error";
import { RequestLimit } from "../entity";
import { AssertDeviceChallengeError } from "../error";
import { RequestLimitFailedTryError } from "../error/RequestLimitFailedTryError";

jest.mock("uuid", () => ({
  v4: jest.fn(() => "be3a62d1-24a0-401c-96dd-3aff95356811"),
}));

MockDate.set("2020-01-01 08:00:00.000");

describe("requestLimitMiddleware", () => {
  let ctx: any;
  let next: any;

  let spyCreateOrUpdateRequestLimit: any;
  let spyValidateRequestLimitBackOff: any;

  beforeEach(() => {
    ctx = {
      cache: {
        requestLimit: mockCacheRequestLimit,
      },
      logger: MOCK_LOGGER,
      request: {
        body: {
          grantType: GrantType.DEVICE_PIN,
          subject: "subject@lindorm.io",
        },
      },
    };
    next = () => Promise.resolve();

    spyCreateOrUpdateRequestLimit = jest
      // @ts-ignore
      .spyOn(create, "createOrUpdateRequestLimit")
      .mockImplementation(() => () => undefined);

    spyValidateRequestLimitBackOff = jest
      // @ts-ignore
      .spyOn(validate, "validateRequestLimitBackOff")
      .mockImplementation(() => () => undefined);
  });

  afterEach(jest.resetAllMocks);

  test("should consider request rate limited", async () => {
    await expect(requestLimitMiddleware(ctx, next)).resolves.toBe(undefined);

    expect(ctx.requestLimit).toMatchSnapshot();
    expect(ctx.metrics.requestLimit).toStrictEqual(expect.any(Number));

    expect(spyCreateOrUpdateRequestLimit).not.toHaveBeenCalled();
    expect(spyValidateRequestLimitBackOff).toHaveBeenCalled();
  });

  test("should consider request clean", async () => {
    ctx.cache.requestLimit.find = jest.fn(() => {
      throw new CacheEntityNotFoundError("key", { result: true });
    });

    await expect(requestLimitMiddleware(ctx, next)).resolves.toBe(undefined);

    expect(ctx.requestLimit).toMatchSnapshot();
    expect(ctx.metrics.requestLimit).toStrictEqual(expect.any(Number));

    expect(spyValidateRequestLimitBackOff).not.toHaveBeenCalled();
  });

  test("should create or update request limit", async () => {
    ctx.requestLimit = new RequestLimit({
      grantType: GrantType.DEVICE_PIN,
      subject: "test@lindorm.io",
    });
    next = () => Promise.reject(new AssertDeviceChallengeError("string", "verifier"));

    await expect(requestLimitMiddleware(ctx, next)).rejects.toThrow(expect.any(RequestLimitFailedTryError));

    expect(spyCreateOrUpdateRequestLimit).toHaveBeenCalled();
  });

  test("should throw error", async () => {
    ctx.cache.requestLimit.find = jest.fn(() => {
      throw new Error("mock");
    });

    await expect(requestLimitMiddleware(ctx, next)).rejects.toStrictEqual(new Error("mock"));

    expect(spyValidateRequestLimitBackOff).not.toHaveBeenCalled();
  });
});
