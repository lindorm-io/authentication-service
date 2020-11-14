import MockDate from "mockdate";
import { InvalidExpiryString } from "../../error";
import { MOCK_UUID, MOCK_LOGGER, getMockRepository, getMockCache } from "../../test/mocks";
import { expireKeyPair } from "./expire-key-pair";

jest.mock("uuid", () => ({
  v4: jest.fn(() => "be3a62d1-24a0-401c-96dd-3aff95356811"),
}));
jest.mock("../../support", () => ({
  assertAccountAdmin: jest.fn(() => () => undefined),
}));

MockDate.set("2020-01-01 08:00:00.000");
const date = new Date("2020-01-01 08:00:00.000");
const tomorrow = new Date("2020-01-02 08:00:00.000");

describe("createKeyPair", () => {
  let getMockContext: any;

  beforeEach(() => {
    getMockContext = () => ({
      cache: getMockCache(),
      logger: MOCK_LOGGER,
      repository: getMockRepository(),
    });
  });

  test("should expire a key-pair using stringToDuration", async () => {
    const ctx = getMockContext();

    await expect(
      expireKeyPair(ctx)({
        keyPairId: MOCK_UUID,
        expires: "1 days",
      }),
    ).resolves.toBe(undefined);

    expect(ctx.repository.keyPair.update).toHaveBeenCalledWith({
      _algorithm: "ES512",
      _created: date,
      _events: [
        {
          created: date,
          name: "key_pair_expires_changed",
          payload: {
            expires: tomorrow,
          },
        },
      ],
      _expires: tomorrow,
      _id: MOCK_UUID,
      _passphrase: null,
      _privateKey: expect.any(String),
      _publicKey: expect.any(String),
      _type: "ec",
      _updated: date,
      _version: 0,
    });
    expect(ctx.cache.keyPair.update).toHaveBeenCalled();
  });

  test("should throw error if expires is wrong", async () => {
    await expect(
      expireKeyPair(getMockContext())({
        keyPairId: MOCK_UUID,
        expires: "wrong",
      }),
    ).rejects.toStrictEqual(expect.any(InvalidExpiryString));
  });
});
