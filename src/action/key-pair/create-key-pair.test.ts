import MockDate from "mockdate";
import { KeyType } from "@lindorm-io/key-pair";
import { createKeyPair } from "./create-key-pair";
import {
  getTestCache,
  getTestRepository,
  getTestKeyPairEC,
  inMemoryCache,
  inMemoryStore,
  resetStore,
  logger,
} from "../../test";

jest.mock("uuid", () => ({
  v4: jest.fn(() => "be3a62d1-24a0-401c-96dd-3aff95356811"),
}));
jest.mock("../../support", () => ({
  assertAccountAdmin: jest.fn(() => () => undefined),
  generateKeyPair: jest.fn(() => getTestKeyPairEC()),
}));

MockDate.set("2020-01-01 08:00:00.000");

describe("createKeyPair", () => {
  let ctx: any;

  beforeEach(async () => {
    ctx = {
      cache: await getTestCache(),
      logger,
      repository: await getTestRepository(),
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
