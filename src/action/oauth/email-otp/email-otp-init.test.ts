import { GrantType, ResponseType } from "../../../enum";
import { Scope } from "@lindorm-io/jwt";
import { performEmailOTPInit } from "./email-otp-init";

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
  sendEmailOTP: jest.fn(() => () => undefined),
}));
jest.mock("@lindorm-io/core", () => ({
  ...jest.requireActual("@lindorm-io/core"),
  getRandomValue: jest.fn(() => "getRandomValue"),
}));

describe("performEmailOTPInit", () => {
  let getMockContext: any;

  beforeEach(() => {
    getMockContext = () => ({
      client: "client",
    });
  });

  test("should create a new session", async () => {
    await expect(
      performEmailOTPInit(getMockContext())({
        codeChallenge: "Z1teIWMlf6xFacp4quXP3O0XI204ZT1b",
        codeMethod: "sha512",
        grantType: GrantType.DEVICE_PIN,
        redirectUri: "https://redirect.uri/",
        responseType: ResponseType.REFRESH,
        scope: Scope.DEFAULT,
        state: "1bVcJqZ1pBeqVLxV",
        subject: "email@lindorm.io",
      }),
    ).resolves.toStrictEqual({
      expires: "expires",
      expiresIn: "expiresIn",
      redirectUri: "https://redirect.uri/",
      state: "1bVcJqZ1pBeqVLxV",
      token: "token",
    });
  });
});
