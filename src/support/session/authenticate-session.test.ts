import MockDate from "mockdate";
import { Account, Session } from "../../entity";
import { authenticateSession } from "./authenticate-session";
import { MOCK_ACCOUNT_OPTIONS, MOCK_SESSION_OPTIONS, getMockRepository } from "../../test/mocks";
import { InvalidAuthorizationTokenError } from "../../error";

jest.mock("uuid", () => ({
  v4: jest.fn(() => "be3a62d1-24a0-401c-96dd-3aff95356811"),
}));
jest.mock("./expires", () => ({
  getSessionExpires: jest.fn(() => new Date()),
}));

MockDate.set("2020-01-01 08:00:00.000");

describe("authenticateSession", () => {
  let getMockContext: any;

  let account: Account;
  let session: Session;

  beforeEach(() => {
    getMockContext = () => ({
      repository: getMockRepository(),
    });

    account = new Account(MOCK_ACCOUNT_OPTIONS);
    session = new Session(MOCK_SESSION_OPTIONS);
  });

  test("should authenticate session and update", async () => {
    await expect(authenticateSession(getMockContext())({ account, session })).resolves.toMatchSnapshot();
  });

  test("should throw error if session has already been authenticated", async () => {
    session.authenticated = true;

    await expect(authenticateSession(getMockContext())({ account, session })).rejects.toStrictEqual(
      expect.any(InvalidAuthorizationTokenError),
    );
  });
});
