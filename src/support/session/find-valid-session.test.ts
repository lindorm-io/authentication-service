import MockDate from "mockdate";
import { MOCK_CODE_VERIFIER, MOCK_SESSION_OPTIONS, getMockRepository } from "../../test/mocks";
import { Client, ISessionOptions, Session } from "../../entity";
import { InvalidAuthorizationError, InvalidClientError, InvalidGrantTypeError, InvalidSubjectError } from "../../error";
import { findValidSession } from "./find-valid-session";

jest.mock("uuid", () => ({
  v4: jest.fn(() => "be3a62d1-24a0-401c-96dd-3aff95356811"),
}));
jest.mock("./challenge", () => ({
  assertCodeChallenge: jest.fn(() => undefined),
}));
jest.mock("./expires", () => ({
  assertSessionIsNotExpired: jest.fn(() => undefined),
}));

MockDate.set("2020-01-01 08:00:00.000");

describe("findValidSession", () => {
  let getMockContext: any;

  beforeEach(() => {
    const mockRepository = getMockRepository();
    mockRepository.session.find = jest.fn(
      (filter: ISessionOptions) =>
        new Session({
          ...MOCK_SESSION_OPTIONS,
          clientId: "clientId",
          deviceId: "deviceId",
          refreshId: "refreshId",
          ...filter,
        }),
    );
    getMockContext = () => ({
      client: new Client({ id: "clientId" }),
      repository: mockRepository,
      token: { authorization: { id: "authorizationId", subject: "sessionId" } },
    });
  });

  test("should find and validate session", async () => {
    await expect(
      findValidSession(getMockContext())({
        codeVerifier: MOCK_CODE_VERIFIER,
        grantType: "grantType",
        subject: "email@lindorm.io",
      }),
    ).resolves.toMatchSnapshot();
  });

  test("should throw error when authorizationId is wrong", async () => {
    const ctx = getMockContext();
    ctx.token.authorization.id = "wrong";

    await expect(
      findValidSession(ctx)({
        codeVerifier: MOCK_CODE_VERIFIER,
        grantType: "grantType",
        subject: "email@lindorm.io",
      }),
    ).rejects.toStrictEqual(expect.any(InvalidAuthorizationError));

    expect(ctx.repository.session.remove).toHaveBeenCalled();
  });

  test("should throw error when clientId is wrong", async () => {
    const ctx = getMockContext();
    ctx.client = new Client({ id: "wrong" });

    await expect(
      findValidSession(ctx)({
        codeVerifier: MOCK_CODE_VERIFIER,
        grantType: "grantType",
        subject: "email@lindorm.io",
      }),
    ).rejects.toStrictEqual(expect.any(InvalidClientError));

    expect(ctx.repository.session.remove).toHaveBeenCalled();
  });

  test("should throw error when grantType is wrong", async () => {
    const ctx = getMockContext();

    await expect(
      findValidSession(ctx)({
        codeVerifier: MOCK_CODE_VERIFIER,
        grantType: "wrong",
        subject: "email@lindorm.io",
      }),
    ).rejects.toStrictEqual(expect.any(InvalidGrantTypeError));

    expect(ctx.repository.session.remove).toHaveBeenCalled();
  });

  test("should throw error when subject is wrong", async () => {
    const ctx = getMockContext();

    await expect(
      findValidSession(ctx)({
        codeVerifier: MOCK_CODE_VERIFIER,
        grantType: "grantType",
        subject: "wrong",
      }),
    ).rejects.toStrictEqual(expect.any(InvalidSubjectError));

    expect(ctx.repository.session.remove).toHaveBeenCalled();
  });
});
