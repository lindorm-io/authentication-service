import MockDate from "mockdate";
import { MOCK_DEVICE_OPTIONS, getMockRepository } from "../../test/mocks";
import { Device } from "../../entity";
import { createSession } from "./create-session";
import { Client } from "@lindorm-io/koa-client";

jest.mock("uuid", () => ({
  v4: jest.fn(() => "be3a62d1-24a0-401c-96dd-3aff95356811"),
}));
jest.mock("./otp", () => ({
  encryptSessionOTP: jest.fn(() => "encryptSessionOTP"),
}));
jest.mock("./expires", () => ({
  getSessionExpires: jest.fn(() => new Date()),
}));

MockDate.set("2020-01-01 08:00:00.000");

describe("createSession", () => {
  let getMockContext: any;

  beforeEach(() => {
    getMockContext = () => ({
      client: new Client({ id: "client-id" }),
      device: new Device({ ...MOCK_DEVICE_OPTIONS, id: "device-id" }),
      userAgent: {
        browser: "browser",
        geoIp: "geoIp",
        os: "os",
        platform: "platform",
        source: "source",
        version: "version",
      },
      repository: getMockRepository(),
    });
  });

  test("should create a new session", async () => {
    await expect(
      createSession(getMockContext())({
        codeChallenge: "codeChallenge",
        codeMethod: "codeMethod",
        grantType: "grantType",
        redirectUri: "redirectUri",
        responseType: "responseType",
        deviceChallenge: "deviceChallenge",
        otpCode: "otpCode",
        scope: "scope",
        state: "state",
        subject: "subject",
      }),
    ).resolves.toMatchSnapshot();
  });

  test("should create a new session without optional values", async () => {
    await expect(
      createSession(getMockContext())({
        codeChallenge: "codeChallenge",
        codeMethod: "codeMethod",
        grantType: "grantType",
        redirectUri: "redirectUri",
        responseType: "responseType",
        scope: "scope",
        state: "state",
        subject: "subject",
      }),
    ).resolves.toMatchSnapshot();
  });
});
