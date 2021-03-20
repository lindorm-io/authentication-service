import MockDate from "mockdate";
import { GrantType } from "../../enum";
import { createOrUpdateRequestLimit } from "./create-or-update-request-limit";
import { mockCacheRequestLimit } from "../../test/mocks";
import { RequestLimit } from "../../entity";

jest.mock("uuid", () => ({
  v4: jest.fn(() => "addde23d-83fe-46bf-a32f-dbc77efa0484"),
}));

MockDate.set("2020-01-01 08:00:00.000");
const date = new Date("2020-01-01 08:00:00.000");

describe("createOrUpdateRequestLimit", () => {
  let ctx: any;

  beforeEach(() => {
    ctx = {
      cache: {
        requestLimit: mockCacheRequestLimit,
      },
    };
  });

  afterEach(jest.resetAllMocks);

  test("should create a request limit in the cache", async () => {
    await expect(
      createOrUpdateRequestLimit(ctx)({
        subject: "subject@lindorm.io",
        grantType: GrantType.DEVICE_PIN,
      }),
    ).resolves.toBe(undefined);

    expect(ctx.cache.requestLimit.create).toHaveBeenCalledWith({
      _backOffUntil: null,
      _created: date,
      _events: [],
      _failedTries: 1,
      _grantType: "pin_code",
      _id: "addde23d-83fe-46bf-a32f-dbc77efa0484",
      _subject: "subject@lindorm.io",
      _updated: date,
      _version: 0,
    });

    expect(ctx.requestLimit).toMatchSnapshot();
  });

  test("should update existing request limit", async () => {
    ctx.requestLimit = new RequestLimit({
      id: "addde23d-83fe-46bf-a32f-dbc77efa0484",
      subject: "subject@lindorm.io",
      grantType: GrantType.DEVICE_PIN,
      failedTries: 10,
    });

    await expect(
      createOrUpdateRequestLimit(ctx)({
        subject: "subject@lindorm.io",
        grantType: GrantType.DEVICE_PIN,
      }),
    ).resolves.toBe(undefined);

    expect(ctx.cache.requestLimit.update).toHaveBeenCalledWith({
      _backOffUntil: new Date("2020-01-01T09:00:00.000Z"),
      _created: date,
      _events: [],
      _failedTries: 11,
      _grantType: "pin_code",
      _id: "addde23d-83fe-46bf-a32f-dbc77efa0484",
      _subject: "subject@lindorm.io",
      _updated: date,
      _version: 0,
    });

    expect(ctx.requestLimit).toMatchSnapshot();
  });
});
