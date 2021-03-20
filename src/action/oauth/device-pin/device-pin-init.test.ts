import { GrantType, ResponseType } from "../../../enum";
import { Scope } from "@lindorm-io/jwt";
import { performDevicePINInit } from "./device-pin-init";

jest.mock("../../../util", () => ({
  assertValidResponseTypeInput: jest.fn(() => undefined),
  assertValidScopeInput: jest.fn(() => undefined),
}));
jest.mock("../../../support", () => ({
  createSession: jest.fn(() => () => "session"),
  getAuthorizationToken: jest.fn(() => () => ({
    expires: "expires",
    expiresIn: "expiresIn",
    token: "token",
  })),
}));
jest.mock("@lindorm-io/core", () => ({
  ...jest.requireActual("@lindorm-io/core"),
  getRandomValue: jest.fn(() => "getRandomValue"),
}));

describe("performDevicePINInit", () => {
  let ctx: any;

  beforeEach(() => {
    ctx = {
      client: "client",
      metadata: {
        deviceId: "47d9ba18-22bd-40aa-8e34-85746b14ca5d",
      },
    };
  });

  test("should create a new session", async () => {
    await expect(
      performDevicePINInit(ctx)({
        deviceId: "47d9ba18-22bd-40aa-8e34-85746b14ca5d",
        codeChallenge: "Z1teIWMlf6xFacp4quXP3O0XI204ZT1b",
        codeMethod: "sha512",
        grantType: GrantType.DEVICE_PIN,
        redirectUri: "https://redirect.uri/",
        responseType: ResponseType.REFRESH,
        scope: Scope.DEFAULT,
        state: "1bVcJqZ1pBeqVLxV",
        subject: "email@lindorm.io",
      }),
    ).resolves.toMatchSnapshot();
  });
});
