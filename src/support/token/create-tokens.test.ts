import MockDate from "mockdate";
import { Account, Device, Session } from "../../entity";
import { ResponseType } from "../../enum";
import { Scope } from "@lindorm-io/jwt";
import { createTokens } from "./create-tokens";
import {
  MOCK_ACCOUNT_OPTIONS,
  MOCK_CLIENT_OPTIONS,
  MOCK_DEVICE_OPTIONS,
  MOCK_SESSION_OPTIONS,
  MOCK_EC_TOKEN_ISSUER,
  MOCK_LOGGER,
  getMockRepository,
} from "../../test/mocks";
import { Client } from "@lindorm-io/koa-client";

jest.mock("uuid", () => ({
  v4: jest.fn(() => "be3a62d1-24a0-401c-96dd-3aff95356811"),
}));
jest.mock("./access", () => ({
  getAccessToken: jest.fn(() => () => "accessToken"),
}));
jest.mock("./identity", () => ({
  getIdentityToken: jest.fn(() => () => "identityToken"),
}));
jest.mock("./refresh", () => ({
  getRefreshToken: jest.fn(() => () => "refreshToken"),
}));

MockDate.set("2020-01-01 08:00:00.000");

describe("createTokens", () => {
  let getMockContext: any;

  let account: Account;
  let client: Client;
  let device: Device;
  let session: Session;

  beforeEach(() => {
    getMockContext = () => ({
      issuer: { tokenIssuer: MOCK_EC_TOKEN_ISSUER },
      logger: MOCK_LOGGER,
      repository: getMockRepository(),
    });

    account = new Account(MOCK_ACCOUNT_OPTIONS);
    client = new Client(MOCK_CLIENT_OPTIONS);
    device = new Device(MOCK_DEVICE_OPTIONS);
    session = new Session({
      ...MOCK_SESSION_OPTIONS,
      refreshId: "refreshId",
      scope: `${Scope.DEFAULT} ${Scope.OPENID}`,
    });
  });

  test("should return refresh token", () => {
    expect(
      createTokens(getMockContext())({
        account,
        authMethodsReference: "authMethodsReference",
        client,
        device,
        payload: {},
        responseType: ResponseType.REFRESH,
        session,
      }),
    ).toStrictEqual({
      refreshToken: "refreshToken",
    });
  });

  test("should return access token", () => {
    expect(
      createTokens(getMockContext())({
        account,
        authMethodsReference: "authMethodsReference",
        client,
        device,
        payload: {},
        responseType: ResponseType.ACCESS,
        session,
      }),
    ).toStrictEqual({
      accessToken: "accessToken",
    });
  });

  test("should return access token", () => {
    expect(
      createTokens(getMockContext())({
        account,
        authMethodsReference: "authMethodsReference",
        client,
        device,
        payload: {},
        responseType: ResponseType.IDENTITY,
        session,
      }),
    ).toStrictEqual({
      identityToken: "identityToken",
    });
  });

  test("should return all tokens", () => {
    expect(
      createTokens(getMockContext())({
        account,
        authMethodsReference: "authMethodsReference",
        client,
        device,
        payload: {},
        responseType: `${ResponseType.REFRESH} ${ResponseType.ACCESS} ${ResponseType.IDENTITY}`,
        session,
      }),
    ).toStrictEqual({
      accessToken: "accessToken",
      identityToken: "identityToken",
      refreshToken: "refreshToken",
    });
  });
});
