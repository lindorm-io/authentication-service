import MockDate from "mockdate";
import { KeyPair, KeyType } from "@lindorm-io/key-pair";
import { MOCK_KEY_PAIR_OPTIONS, MOCK_LOGGER } from "../../test/mocks";
import { createKeyPair } from "./create-key-pair";
import { getMockRepository } from "../../test/mocks";

jest.mock("uuid", () => ({
  v4: jest.fn(() => "be3a62d1-24a0-401c-96dd-3aff95356811"),
}));
jest.mock("../../support", () => ({
  assertAccountAdmin: jest.fn(() => () => undefined),
  generateKeyPair: jest.fn(() => new KeyPair(MOCK_KEY_PAIR_OPTIONS)),
}));

MockDate.set("2020-01-01 08:00:00.000");
const date = new Date("2020-01-01 08:00:00.000");

describe("createKeyPair", () => {
  let getMockContext: any;

  beforeEach(() => {
    getMockContext = () => ({
      logger: MOCK_LOGGER,
      repository: getMockRepository(),
    });
  });

  test("should create key pair", async () => {
    const ctx = getMockContext();

    await expect(createKeyPair(ctx)({ type: KeyType.EC })).resolves.toStrictEqual({
      algorithm: "ES512",
      keyPairId: "be3a62d1-24a0-401c-96dd-3aff95356811",
      type: "ec",
    });

    expect(ctx.repository.keyPair.create).toHaveBeenCalledWith({
      _algorithm: "ES512",
      _created: date,
      _events: [],
      _expires: null,
      _id: "be3a62d1-24a0-401c-96dd-3aff95356811",
      _passphrase: null,
      _privateKey: expect.any(String),
      _publicKey: expect.any(String),
      _type: "ec",
      _updated: date,
      _version: 0,
    });
  });
});
