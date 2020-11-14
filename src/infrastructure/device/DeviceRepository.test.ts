import MockDate from "mockdate";
import { Device } from "../../entity";
import { DeviceRepository } from "./DeviceRepository";
import { MOCK_LOGGER } from "../../test/mocks/logger";
import { MOCK_MONGO_OPTIONS, MOCK_UUID } from "../../test/mocks/data";
import { MongoConnection, RepositoryEntityNotFoundError } from "@lindorm-io/mongo";
import { baseHash } from "@lindorm-io/core";

jest.mock("uuid", () => ({
  v4: jest.fn(() => "be3a62d1-24a0-401c-96dd-3aff95356811"),
}));

MockDate.set("2020-01-01 08:00:00.000");

describe("DeviceRepository", () => {
  let repository: DeviceRepository;
  let device: Device;

  beforeEach(async () => {
    const mongo = new MongoConnection(MOCK_MONGO_OPTIONS);
    await mongo.connect();

    repository = new DeviceRepository({
      db: mongo.getDatabase(),
      logger: MOCK_LOGGER,
    });
    device = new Device({
      id: MOCK_UUID,

      accountId: MOCK_UUID,
      name: "name",
      pin: {
        signature: baseHash("signature"),
        updated: new Date(),
      },
      publicKey: "publicKey",
      secret: baseHash("secret"),
    });
  });

  test("should create", async () => {
    await expect(repository.create(device)).resolves.toMatchSnapshot();
  });

  test("should update", async () => {
    await repository.create(device);

    await expect(repository.update(device)).resolves.toMatchSnapshot();
  });

  test("should find", async () => {
    await repository.create(device);

    await expect(repository.find({ name: "name" })).resolves.toMatchSnapshot();
  });

  test("should find many", async () => {
    await repository.create(device);
    await repository.create(
      new Device({
        accountId: MOCK_UUID,
        name: "other",
        publicKey: "other-publicKey",
      }),
    );

    await expect(repository.findMany({ accountId: MOCK_UUID })).resolves.toMatchSnapshot();
  });

  test("should remove", async () => {
    await repository.create(device);

    await expect(repository.remove(device)).resolves.toBe(undefined);
    await expect(repository.find({ id: device.id })).rejects.toStrictEqual(expect.any(RepositoryEntityNotFoundError));
  });
});
