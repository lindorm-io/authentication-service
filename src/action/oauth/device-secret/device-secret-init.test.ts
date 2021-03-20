import { GrantType, ResponseType } from "../../../enum";
import { Scope } from "@lindorm-io/jwt";
import { performDeviceSecretInit } from "./device-secret-init";

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

describe("performDeviceSecretInit", () => {
  let ctx: any;

  beforeEach(() => {
    ctx = {
      client: "client",
      metadata: {
        deviceId: "2b3e26f9-3168-4e32-8b08-9e570354223a",
      },
    };
  });

  test("should create a new session", async () => {
    await expect(
      performDeviceSecretInit(ctx)({
        deviceId: "2b3e26f9-3168-4e32-8b08-9e570354223a",
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
