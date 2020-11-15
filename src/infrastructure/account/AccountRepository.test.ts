import MockDate from "mockdate";
import { Account } from "../../entity";
import { AccountRepository } from "./AccountRepository";
import { MOCK_LOGGER } from "../../test/mocks/logger";
import { MOCK_MONGO_OPTIONS, MOCK_UUID } from "../../test/mocks/data";
import { MongoConnection, RepositoryEntityNotFoundError } from "@lindorm-io/mongo";
import { Permission } from "@lindorm-io/jwt";
import { baseHash } from "@lindorm-io/core";

jest.mock("uuid", () => ({
  v4: jest.fn(() => "be3a62d1-24a0-401c-96dd-3aff95356811"),
}));

MockDate.set("2020-01-01 08:00:00.000");

describe("AccountRepository", () => {
  let repository: AccountRepository;
  let account: Account;

  beforeEach(async () => {
    const mongo = new MongoConnection(MOCK_MONGO_OPTIONS);
    await mongo.connect();

    repository = new AccountRepository({
      db: mongo.getDatabase(),
      logger: MOCK_LOGGER,
    });
    account = new Account({
      id: MOCK_UUID,

      email: "email@lindorm.io",
      otp: {
        signature: baseHash("signature"),
        uri: "https://lindorm.io/",
      },
      password: {
        signature: baseHash("signature"),
        updated: new Date(),
      },
      permission: Permission.LOCKED,
    });
  });

  test("should create", async () => {
    await expect(repository.create(account)).resolves.toMatchSnapshot();
  });

  test("should update", async () => {
    await repository.create(account);

    await expect(repository.update(account)).resolves.toMatchSnapshot();
  });

  test("should find", async () => {
    await repository.create(account);

    await expect(repository.find({ email: "email@lindorm.io" })).resolves.toMatchSnapshot();
  });

  test("should find many", async () => {
    await repository.create(account);
    await repository.create(
      new Account({
        email: "other@lindorm.io",
        permission: Permission.LOCKED,
      }),
    );

    await expect(repository.findMany({ permission: Permission.LOCKED })).resolves.toMatchSnapshot();
  });

  test("should remove", async () => {
    await repository.create(account);

    await expect(repository.remove(account)).resolves.toBe(undefined);
    await expect(repository.find({ id: account.id })).rejects.toStrictEqual(expect.any(RepositoryEntityNotFoundError));
  });
});
