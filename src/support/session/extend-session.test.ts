import MockDate from "mockdate";
import { Device, ISessionOptions, Session } from "../../entity";
import { MOCK_DEVICE_OPTIONS, MOCK_SESSION_OPTIONS, getMockRepository } from "../../test/mocks";
import { extendSession } from "./extend-session";
import { InvalidDeviceError, InvalidRefreshTokenError } from "../../error";
import { Client, InvalidClientError } from "@lindorm-io/koa-client";

jest.mock("uuid", () => ({
  v4: jest.fn(() => "be3a62d1-24a0-401c-96dd-3aff95356811"),
}));
jest.mock("./expires", () => ({
  assertSessionIsNotExpired: jest.fn(() => undefined),
  getSessionExpires: jest.fn(() => new Date()),
}));

MockDate.set("2020-01-01 08:00:00.000");

describe("extendSession", () => {
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
      device: new Device({ ...MOCK_DEVICE_OPTIONS, id: "deviceId" }),
      repository: mockRepository,
      token: { refresh: { id: "refreshId", subject: "sessionId" } },
    });
  });

  test("should extend session with refresh token", async () => {
    await expect(extendSession(getMockContext())()).resolves.toMatchSnapshot();
  });

  test("should succeed when device does not exist", async () => {
    const context = getMockContext();
    const ctx = {
      ...context,
      device: null,
      repository: {
        ...context.repository,
        session: {
          ...context.repository.session,
          find: jest.fn(
            (filter: ISessionOptions) =>
              new Session({
                ...MOCK_SESSION_OPTIONS,
                clientId: "clientId",
                deviceId: null,
                refreshId: "refreshId",
                ...filter,
              }),
          ),
        },
      },
    };

    await expect(extendSession(ctx)()).resolves.toMatchSnapshot();
  });

  test("should throw error when refreshId is wrong", async () => {
    const ctx = getMockContext();
    ctx.token.refresh.id = "wrong";

    await expect(extendSession(ctx)()).rejects.toStrictEqual(expect.any(InvalidRefreshTokenError));
  });

  test("should throw error when clientId is wrong", async () => {
    const ctx = getMockContext();
    ctx.client = new Client({ id: "wrong" });

    await expect(extendSession(ctx)()).rejects.toStrictEqual(expect.any(InvalidClientError));
  });

  test("should throw error when deviceId is wrong", async () => {
    const ctx = getMockContext();
    ctx.device = new Device({ ...MOCK_DEVICE_OPTIONS, id: "wrong" });

    await expect(extendSession(ctx)()).rejects.toStrictEqual(expect.any(InvalidDeviceError));
  });
});
