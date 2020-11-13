import MockDate from "mockdate";
import { Client } from "../../entity";
import { ClientRepository } from "./ClientRepository";
import { MOCK_LOGGER } from "../../test/mocks/logger";
import { MOCK_MONGO_OPTIONS, MOCK_UUID } from "../../test/mocks/data";
import { MongoConnection, RepositoryEntityNotFoundError } from "@lindorm-io/mongo";
import { baseHash } from "@lindorm-io/core";

jest.mock("uuid", () => ({
  v4: jest.fn(() => "be3a62d1-24a0-401c-96dd-3aff95356811"),
}));

MockDate.set("2020-01-01 08:00:00.000");

describe("ClientRepository", () => {
  let repository: ClientRepository;
  let client: Client;

  beforeEach(async () => {
    const mongo = new MongoConnection(MOCK_MONGO_OPTIONS);
    await mongo.connect();

    repository = new ClientRepository({
      db: mongo.getDatabase(),
      logger: MOCK_LOGGER,
    });
    client = new Client({
      id: MOCK_UUID,

      approved: false,
      description: "description",
      emailAuthorizationUri: "https://lindorm.io",
      name: "name",
      secret: baseHash("secret"),
    });
  });

  test("should create", async () => {
    await expect(repository.create(client)).resolves.toMatchSnapshot();
  });

  test("should update", async () => {
    await repository.create(client);

    await expect(repository.update(client)).resolves.toMatchSnapshot();
  });

  test("should find", async () => {
    await repository.create(client);

    await expect(repository.find({ name: "name" })).resolves.toMatchSnapshot();
  });

  test("should find many", async () => {
    await repository.create(client);
    await repository.create(
      new Client({
        approved: false,
        name: "other",
      }),
    );

    await expect(repository.findMany({ approved: false })).resolves.toMatchSnapshot();
  });

  test("should remove", async () => {
    await repository.create(client);

    await expect(repository.remove(client)).resolves.toBe(undefined);
    await expect(repository.find({ id: client.id })).rejects.toStrictEqual(expect.any(RepositoryEntityNotFoundError));
  });
});
