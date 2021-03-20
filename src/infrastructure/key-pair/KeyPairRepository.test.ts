import MockDate from "mockdate";
import { KeyPair } from "@lindorm-io/key-pair";
import { KeyPairRepository } from "./KeyPairRepository";
import { MOCK_MONGO_OPTIONS, MOCK_UUID } from "../../test/mocks/data";
import { MongoConnection, RepositoryEntityNotFoundError } from "@lindorm-io/mongo";
import { winston } from "../../logger";

jest.mock("uuid", () => ({
  v4: jest.fn(() => "be3a62d1-24a0-401c-96dd-3aff95356811"),
}));

MockDate.set("2020-01-01 08:00:00.000");

describe("KeyPairRepository", () => {
  let repository: KeyPairRepository;
  let keyPair: KeyPair;

  beforeEach(async () => {
    const mongo = new MongoConnection(MOCK_MONGO_OPTIONS);
    await mongo.connect();

    repository = new KeyPairRepository({
      db: mongo.getDatabase(),
      logger: winston,
    });
    keyPair = new KeyPair({
      id: MOCK_UUID,

      algorithm: "algorithm",
      expires: new Date(),
      passphrase: "passphrase",
      privateKey: "privateKey",
      publicKey: "publicKey",
      type: "type",
    });
  });

  test("should create", async () => {
    await expect(repository.create(keyPair)).resolves.toMatchSnapshot();
  });

  test("should update", async () => {
    await repository.create(keyPair);

    await expect(repository.update(keyPair)).resolves.toMatchSnapshot();
  });

  test("should find", async () => {
    await repository.create(keyPair);

    await expect(repository.find({ type: "type" })).resolves.toMatchSnapshot();
  });

  test("should find many", async () => {
    await repository.create(keyPair);
    await repository.create(
      new KeyPair({
        algorithm: "other",
        privateKey: "privateKey",
        publicKey: "publicKey",
        type: "type",
      }),
    );

    await expect(repository.findMany({ type: "type" })).resolves.toMatchSnapshot();
  });

  test("should remove", async () => {
    await repository.create(keyPair);

    await expect(repository.remove(keyPair)).resolves.toBe(undefined);
    await expect(repository.find({ id: keyPair.id })).rejects.toStrictEqual(expect.any(RepositoryEntityNotFoundError));
  });
});
