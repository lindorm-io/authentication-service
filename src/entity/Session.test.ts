import MockDate from "mockdate";
import { GrantType } from "../enum";
import { Scope } from "@lindorm-io/jwt";
import { Session } from "./Session";

jest.mock("uuid", () => ({
  v4: jest.fn(() => "be3a62d1-24a0-401c-96dd-3aff95356811"),
}));

MockDate.set("2020-01-01 08:00:00.000");

describe("Session.ts", () => {
  let session: Session;

  beforeEach(() => {
    session = new Session({
      accountId: "eb1fc7a5-e141-4be4-9e91-d0fec8ee5c12",
      clientId: "852a0686-a203-4645-a890-fb0710d22638",
      deviceId: "22c42ad2-7f93-4173-9204-8ad100eb2b57",
      expires: new Date("2020-01-01 08:00:00.000"),
      grantType: GrantType.PASSWORD,
      refreshId: "a63e8289-6ee3-4b26-b92b-e8604f51d338",
      scope: [Scope.DEFAULT, Scope.EMAIL, Scope.OPENID, Scope.EMAIL],
    });
  });

  test("should have all data", () => {
    expect(session).toMatchSnapshot();
  });

  test("should have optional data", () => {
    session = new Session({
      accountId: "eb1fc7a5-e141-4be4-9e91-d0fec8ee5c12",
      clientId: "852a0686-a203-4645-a890-fb0710d22638",
      expires: new Date("2020-01-01 08:00:00.000"),
      grantType: GrantType.PASSWORD,
      refreshId: "a63e8289-6ee3-4b26-b92b-e8604f51d338",
      scope: [Scope.DEFAULT, Scope.EMAIL, Scope.OPENID, Scope.EMAIL],
    });

    expect(session).toMatchSnapshot();
  });

  test("should create", () => {
    session.create();
    expect(session.events).toMatchSnapshot();
  });

  test("should get accountId", () => {
    expect(session.accountId).toMatchSnapshot();
  });

  test("should get clientId", () => {
    expect(session.clientId).toMatchSnapshot();
  });

  test("should get/set expires", () => {
    expect(session.expires).toMatchSnapshot();
    session.expires = new Date("2021-01-01 00:00:01");
    expect(session.expires).toMatchSnapshot();
    expect(session.events).toMatchSnapshot();
  });

  test("should get grantType", () => {
    expect(session.grantType).toMatchSnapshot();
  });

  test("should get/set refreshId", () => {
    expect(session.refreshId).toMatchSnapshot();
    session.refreshId = "cf588ada-db91-4c05-b758-30b21d44b4b5";
    expect(session.refreshId).toMatchSnapshot();
    expect(session.events).toMatchSnapshot();
  });

  test("should get scope", () => {
    expect(session.scope).toMatchSnapshot();
  });
});
