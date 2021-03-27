import MockDate from "mockdate";
import { GrantType } from "../../enum";
import { RepositoryEntityNotFoundError } from "@lindorm-io/mongo";
import { Scope } from "@lindorm-io/jwt";
import { Session } from "../../entity";
import { SessionRepository } from "./SessionRepository";
import { getTestRepository, resetStore } from "../../test";

jest.mock("uuid", () => ({
  v4: jest.fn(() => "be3a62d1-24a0-401c-96dd-3aff95356811"),
}));

MockDate.set("2020-01-01 08:00:00.000");

describe("SessionRepository", () => {
  let repository: SessionRepository;
  let session: Session;

  beforeEach(async () => {
    ({ session: repository } = await getTestRepository());

    session = new Session({
      id: "be3a62d1-24a0-401c-96dd-3aff95356811",
      accountId: "be3a62d1-24a0-401c-96dd-3aff95356811",
      clientId: "be3a62d1-24a0-401c-96dd-3aff95356811",
      deviceId: "be3a62d1-24a0-401c-96dd-3aff95356811",
      expires: new Date(),
      grantType: GrantType.EMAIL_OTP,
      refreshId: "be3a62d1-24a0-401c-96dd-3aff95356811",
      scope: [Scope.DEFAULT],
    });
  });

  afterEach(resetStore);

  test("should create", async () => {
    await expect(repository.create(session)).resolves.toMatchSnapshot();
  });

  test("should update", async () => {
    await repository.create(session);

    await expect(repository.update(session)).resolves.toMatchSnapshot();
  });

  test("should find", async () => {
    await repository.create(session);

    await expect(repository.find({ accountId: "be3a62d1-24a0-401c-96dd-3aff95356811" })).resolves.toMatchSnapshot();
  });

  test("should find many", async () => {
    await repository.create(session);
    await repository.create(
      new Session({
        accountId: "be3a62d1-24a0-401c-96dd-3aff95356811",
        clientId: "be3a62d1-24a0-401c-96dd-3aff95356811",
        expires: new Date(),
        grantType: GrantType.EMAIL_LINK,
        refreshId: "74e8763a-84f4-4b83-ac1a-3b6cad63b110",
        scope: [Scope.DEFAULT],
      }),
    );

    await expect(repository.findMany({ accountId: "be3a62d1-24a0-401c-96dd-3aff95356811" })).resolves.toMatchSnapshot();
  });

  test("should remove", async () => {
    await repository.create(session);

    await expect(repository.remove(session)).resolves.toBe(undefined);
    await expect(repository.find({ id: session.id })).rejects.toStrictEqual(expect.any(RepositoryEntityNotFoundError));
  });
});
