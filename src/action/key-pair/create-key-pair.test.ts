import MockDate from "mockdate";
import { KeyPair, KeyType } from "@lindorm-io/key-pair";
import { MOCK_KEY_PAIR_OPTIONS } from "../../test/mocks";
import { createKeyPair } from "./create-key-pair";
import { getGreyBoxCache, getGreyBoxRepository, inMemoryCache, inMemoryStore, resetStore } from "../../test";
import { winston } from "../../logger";

jest.mock("uuid", () => ({
  v4: jest.fn(() => "be3a62d1-24a0-401c-96dd-3aff95356811"),
}));
jest.mock("../../support", () => ({
  assertAccountAdmin: jest.fn(() => () => undefined),
  generateKeyPair: jest.fn(() => new KeyPair(MOCK_KEY_PAIR_OPTIONS)),
}));

MockDate.set("2020-01-01 08:00:00.000");

describe("createKeyPair", () => {
  let ctx: any;

  beforeEach(async () => {
    ctx = {
      cache: await getGreyBoxCache(),
      logger: winston,
      repository: await getGreyBoxRepository(),
    };
  });

  afterEach(resetStore);

  test("should create key pair", async () => {
    await expect(createKeyPair(ctx)({ type: KeyType.EC })).resolves.toStrictEqual({
      algorithm: "ES512",
      keyPairId: "be3a62d1-24a0-401c-96dd-3aff95356811",
      type: "ec",
    });

    expect(inMemoryCache).toMatchSnapshot();
    expect(inMemoryStore).toMatchSnapshot();
  });
});
