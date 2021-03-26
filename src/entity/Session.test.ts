import MockDate from "mockdate";
import { Session } from "./Session";

jest.mock("uuid", () => ({
  v4: jest.fn(() => "be3a62d1-24a0-401c-96dd-3aff95356811"),
}));

MockDate.set("2020-01-01 08:00:00.000");
const date = new Date("2020-01-01 08:00:00.000");

describe("Session.ts", () => {
  let session: Session;

  beforeEach(() => {
    session = new Session({
      accountId: "accountId",
      agent: {
        browser: "browser",
        geoIp: { geoIp: "geoIp" },
        os: "os",
        platform: "platform",
        source: "source",
        version: "version",
      },
      authenticated: true,
      authorization: {
        codeChallenge: "codeChallenge",
        codeMethod: "codeMethod",
        deviceChallenge: "deviceChallenge",
        email: "email@lindorm.io",
        id: "id",
        otpCode: "otpCode",
        redirectUri: "redirectUri",
        responseType: "responseType",
      },
      clientId: "clientId",
      deviceId: "deviceId",
      expires: date,
      grantType: "grantType",
      refreshId: "refreshId",
      scope: ["scope"],
    });
  });

  test("should have all data", () => {
    expect(session).toMatchSnapshot();
  });

  test("should have optional data", () => {
    session = new Session({
      authorization: {
        codeChallenge: "codeChallenge",
        codeMethod: "codeMethod",
        email: "email@lindorm.io",
        id: "id",
        redirectUri: "redirectUri",
        responseType: "responseType",
      },
      clientId: "clientId",
      expires: date,
      grantType: "grantType",
      scope: ["scope"],
    });

    expect(session).toMatchSnapshot();
  });

  test("should create", () => {
    session.create();
    expect(session.events).toMatchSnapshot();
  });

  test("should get/set accountId", () => {
    expect(session.accountId).toMatchSnapshot();

    session.accountId = "new-accountId";

    expect(session.accountId).toMatchSnapshot();
    expect(session.events).toMatchSnapshot();
  });

  test("should get agent", () => {
    expect(session.agent).toMatchSnapshot();
  });

  test("should get/set authenticated", () => {
    expect(session.authenticated).toMatchSnapshot();

    session.authenticated = false;

    expect(session.authenticated).toMatchSnapshot();
    expect(session.events).toMatchSnapshot();
  });

  test("should get authorization", () => {
    expect(session.authorization).toMatchSnapshot();
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

    session.refreshId = "new-refreshId";

    expect(session.refreshId).toMatchSnapshot();
    expect(session.events).toMatchSnapshot();
  });

  test("should get scope", () => {
    expect(session.scope).toMatchSnapshot();
  });
});
