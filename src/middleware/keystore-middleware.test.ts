import MockDate from "mockdate";
import { keystoreMiddleware } from "./keystore-middleware";
import { getGreyBoxCache, getKeyPairEC, getKeyPairRSA } from "../test";
import { winston } from "../logger";

jest.mock("uuid", () => ({
  v4: jest.fn(() => "be3a62d1-24a0-401c-96dd-3aff95356811"),
}));

MockDate.set("2020-01-01 08:00:00.000");

describe("keystoreMiddleware", () => {
  let ctx: any;
  let next: any;

  beforeEach(async () => {
    ctx = {
      cache: await getGreyBoxCache(),
      logger: winston,
    };

    await ctx.cache.keyPair.create(getKeyPairEC());
    await ctx.cache.keyPair.create(getKeyPairRSA());

    next = () => Promise.resolve();
  });

  test("should successfully set keystore on ctx", async () => {
    await expect(keystoreMiddleware(ctx, next)).resolves.toBe(undefined);

    expect(ctx.keystore).toMatchSnapshot();
  });
});
