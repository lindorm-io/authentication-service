import MockDate from "mockdate";
import { GrantType } from "../../enum";
import { createOrUpdateRequestLimit } from "./create-or-update-request-limit";
import { RequestLimit } from "../../entity";
import { getTestCache, inMemoryCache, resetCache } from "../../test";

jest.mock("uuid", () => ({
  v4: jest.fn(() => "addde23d-83fe-46bf-a32f-dbc77efa0484"),
}));

MockDate.set("2020-01-01 08:00:00.000");

describe("createOrUpdateRequestLimit", () => {
  let ctx: any;

  beforeEach(async () => {
    ctx = {
      cache: await getTestCache(),
    };
  });

  afterEach(resetCache);

  test("should create a request limit in the cache", async () => {
    await expect(
      createOrUpdateRequestLimit(ctx)({
        subject: "subject@lindorm.io",
        grantType: GrantType.DEVICE_PIN,
      }),
    ).resolves.toBe(undefined);

    expect(inMemoryCache).toMatchSnapshot();
    expect(ctx.requestLimit).toMatchSnapshot();
  });

  test("should update existing request limit", async () => {
    ctx.requestLimit = new RequestLimit({
      id: "addde23d-83fe-46bf-a32f-dbc77efa0484",
      subject: "subject@lindorm.io",
      grantType: GrantType.DEVICE_PIN,
      failedTries: 10,
    });

    await ctx.cache.requestLimit.create(ctx.requestLimit);

    await expect(
      createOrUpdateRequestLimit(ctx)({
        subject: "subject@lindorm.io",
        grantType: GrantType.DEVICE_PIN,
      }),
    ).resolves.toBe(undefined);

    expect(inMemoryCache).toMatchSnapshot();
    expect(ctx.requestLimit).toMatchSnapshot();
  });
});
