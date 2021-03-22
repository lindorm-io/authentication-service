import MockDate from "mockdate";
import { GrantType, ResponseType } from "../../enum";
import { Scope } from "@lindorm-io/jwt";
import { baseHash } from "@lindorm-io/core";
import { createSession } from "./create-session";
import { getTestRepository, getTestClient, inMemoryStore, resetStore } from "../../test";

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
  let ctx: any;

  beforeEach(async () => {
    ctx = {
      client: getTestClient(),
      metadata: { deviceId: "2122b49f-3dc0-46c2-9a8b-6cec5e26a389" },
      userAgent: {
        browser: "browser",
        geoIp: { ip: "geo" },
        os: "os",
        platform: "platform",
        source: "source",
        version: "version",
      },
      repository: await getTestRepository(),
    };
  });

  afterEach(resetStore);

  test("should create a new session", async () => {
    await expect(
      createSession(ctx)({
        codeChallenge: "H4LnTn7e1DltMsohJgIeKSNgpvppJ1qP6QRRD9Ai1pw=",
        codeMethod: "sha256",
        grantType: GrantType.DEVICE_PIN,
        redirectUri: "https://lindorm.io",
        responseType: ResponseType.ACCESS,
        deviceChallenge: "H4LnTn7e1DltMsohJgIeKSNgpvppJ1qP6QRRD9Ai1pw=",
        otpCode: "otpCode",
        scope: Scope.DEFAULT,
        state: baseHash("state"),
        subject: "email@lindorm.io",
      }),
    ).resolves.toMatchSnapshot();

    expect(inMemoryStore).toMatchSnapshot();
  });

  test("should create a new session without optional values", async () => {
    await expect(
      createSession(ctx)({
        codeChallenge: "H4LnTn7e1DltMsohJgIeKSNgpvppJ1qP6QRRD9Ai1pw=",
        codeMethod: "sha256",
        grantType: GrantType.DEVICE_PIN,
        redirectUri: "https://lindorm.io",
        responseType: ResponseType.REFRESH,
        scope: [Scope.DEFAULT, Scope.EDIT].join(" "),
        state: baseHash("other_state"),
        subject: "other@lindorm.io",
      }),
    ).resolves.toMatchSnapshot();

    expect(inMemoryStore).toMatchSnapshot();
  });
});
