import MockDate from "mockdate";
import { InvalidExpiryString } from "../../error";
import { KeyPair } from "@lindorm-io/key-pair";
import { MOCK_KEY_PAIR_OPTIONS } from "../../test/mocks";
import { expireKeyPair } from "./expire-key-pair";
import { getGreyBoxCache, getGreyBoxRepository, inMemoryCache, inMemoryStore, resetStore } from "../../test";
import { winston } from "../../logger";

jest.mock("uuid", () => ({
  v4: jest.fn(() => "be3a62d1-24a0-401c-96dd-3aff95356811"),
}));
jest.mock("../../support", () => ({
  assertAccountAdmin: jest.fn(() => () => undefined),
}));

MockDate.set("2020-01-01 08:00:00.000");

describe("createKeyPair", () => {
  let ctx: any;
  let keyPair: KeyPair;

  beforeEach(async () => {
    ctx = {
      cache: await getGreyBoxCache(),
      logger: winston,
      repository: await getGreyBoxRepository(),
    };
    keyPair = await ctx.repository.keyPair.create(new KeyPair(MOCK_KEY_PAIR_OPTIONS));
  });

  afterEach(resetStore);

  test("should expire a key-pair using stringToDuration", async () => {
    await expect(
      expireKeyPair(ctx)({
        keyPairId: keyPair.id,
        expires: "1 days",
      }),
    ).resolves.toBe(undefined);

    expect(inMemoryCache).toMatchSnapshot();
    expect(inMemoryStore).toMatchSnapshot();
  });

  test("should throw error if expires is wrong", async () => {
    await expect(
      expireKeyPair(ctx)({
        keyPairId: keyPair.id,
        expires: "wrong",
      }),
    ).rejects.toStrictEqual(expect.any(InvalidExpiryString));
  });
});
