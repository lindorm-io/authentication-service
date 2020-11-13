import MockDate from "mockdate";
import { GrantType, ResponseType, Scope } from "../../enum";
import { MOCK_CODE_CHALLENGE, MOCK_CODE_METHOD, MOCK_MONGO_OPTIONS, MOCK_UUID } from "../../test/mocks/data";
import { MOCK_LOGGER } from "../../test/mocks/logger";
import { MongoConnection, RepositoryEntityNotFoundError } from "@lindorm-io/mongo";
import { Session } from "../../entity";
import { SessionRepository } from "./SessionRepository";

jest.mock("uuid", () => ({
  v4: jest.fn(() => "be3a62d1-24a0-401c-96dd-3aff95356811"),
}));

MockDate.set("2020-01-01 08:00:00.000");

describe("SessionRepository", () => {
  let repository: SessionRepository;
  let session: Session;

  beforeEach(async () => {
    const mongo = new MongoConnection(MOCK_MONGO_OPTIONS);
    await mongo.connect();

    repository = new SessionRepository({
      db: mongo.getDatabase(),
      logger: MOCK_LOGGER,
    });
    session = new Session({
      id: MOCK_UUID,

      accountId: MOCK_UUID,
      agent: {
        browser: "browser",
        geoIp: { geoIp: "geoIp" },
        os: "os",
        platform: "platform",
        source: "source",
        version: "version",
      },
      authenticated: false,
      authorization: {
        codeChallenge: MOCK_CODE_CHALLENGE,
        codeMethod: MOCK_CODE_METHOD,
        deviceChallenge: MOCK_CODE_CHALLENGE,
        email: "email@lindorm.io",
        id: MOCK_UUID,
        otpCode: "otpCode",
        redirectUri: "https://lindorm.io/",
        responseType: [ResponseType.REFRESH, ResponseType.ACCESS, ResponseType.IDENTITY].join(" "),
      },
      clientId: MOCK_UUID,
      deviceId: MOCK_UUID,
      expires: new Date(),
      grantType: GrantType.EMAIL_OTP,
      refreshId: MOCK_UUID,
      scope: Scope.DEFAULT,
    });
  });

  test("should create", async () => {
    await expect(repository.create(session)).resolves.toMatchSnapshot();
  });

  test("should update", async () => {
    await repository.create(session);

    await expect(repository.update(session)).resolves.toMatchSnapshot();
  });

  test("should find", async () => {
    await repository.create(session);

    await expect(repository.find({ accountId: MOCK_UUID })).resolves.toMatchSnapshot();
  });

  test("should find many", async () => {
    await repository.create(session);
    await repository.create(
      new Session({
        accountId: MOCK_UUID,
        authorization: {
          codeChallenge: MOCK_CODE_CHALLENGE,
          codeMethod: MOCK_CODE_METHOD,
          deviceChallenge: MOCK_CODE_CHALLENGE,
          email: "email@lindorm.io",
          id: MOCK_UUID,
          otpCode: "otpCode",
          redirectUri: "https://lindorm.io/",
          responseType: [ResponseType.REFRESH, ResponseType.ACCESS, ResponseType.IDENTITY].join(" "),
        },
        clientId: MOCK_UUID,
        expires: new Date(),
        grantType: GrantType.EMAIL_LINK,
        scope: Scope.DEFAULT,
      }),
    );

    await expect(repository.findMany({ accountId: MOCK_UUID })).resolves.toMatchSnapshot();
  });

  test("should remove", async () => {
    await repository.create(session);

    await expect(repository.remove(session)).resolves.toBe(undefined);
    await expect(repository.find({ id: session.id })).rejects.toStrictEqual(expect.any(RepositoryEntityNotFoundError));
  });
});
