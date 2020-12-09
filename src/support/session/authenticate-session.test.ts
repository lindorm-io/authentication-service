import MockDate from "mockdate";
import { Account, Session } from "../../entity";
import { Client } from "@lindorm-io/koa-client";
import { GrantType, ResponseType } from "../../enum";
import { InvalidAuthorizationTokenError } from "../../error";
import { MOCK_CODE_CHALLENGE, MOCK_CODE_METHOD } from "../../test/mocks";
import { Scope } from "@lindorm-io/jwt";
import { authenticateSession } from "./authenticate-session";
import { getGreyBoxRepository, inMemoryStore } from "../../test";

jest.mock("uuid", () => ({
  v4: jest.fn(() => "be3a62d1-24a0-401c-96dd-3aff95356811"),
}));
jest.mock("./expires", () => ({
  getSessionExpires: jest.fn(() => new Date()),
}));

MockDate.set("2020-01-01 08:00:00.000");

describe("authenticateSession", () => {
  let ctx: any;

  let account: Account;
  let session: Session;

  beforeEach(async () => {
    ctx = {
      client: new Client({
        id: "025ced26-37af-46fd-b8cc-7652f29774c4",
      }),
      repository: await getGreyBoxRepository(),
    };

    account = new Account({
      email: "test@lindorm.io",
    });
    session = await ctx.repository.session.create(
      new Session({
        authorization: {
          codeChallenge: MOCK_CODE_CHALLENGE,
          codeMethod: MOCK_CODE_METHOD,
          email: "test@lindorm.io",
          id: "454001ea-0cec-432f-bb7d-9f7db933e844",
          redirectUri: "https://lindorm.io/",
          responseType: ResponseType.REFRESH,
        },
        clientId: "025ced26-37af-46fd-b8cc-7652f29774c4",
        expires: new Date("2999-12-12 12:12:12.000"),
        grantType: GrantType.EMAIL_OTP,
        scope: [Scope.DEFAULT, Scope.EDIT, Scope.OPENID].join(" "),
      }),
    );
  });

  test("should authenticate session and update", async () => {
    await expect(authenticateSession(ctx)({ account, session })).resolves.toMatchSnapshot();

    expect(inMemoryStore).toMatchSnapshot();
  });

  test("should throw error if session has already been authenticated", async () => {
    session.authenticated = true;

    await expect(authenticateSession(ctx)({ account, session })).rejects.toStrictEqual(
      expect.any(InvalidAuthorizationTokenError),
    );
  });
});
