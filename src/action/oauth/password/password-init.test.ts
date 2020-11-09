import { GrantType, ResponseType, Scope } from "../../../enum";
import { performPasswordInit } from "./password-init";

jest.mock("../../../util", () => ({
  assertResponseType: jest.fn(() => undefined),
}));
jest.mock("../../../support", () => ({
  createSession: jest.fn(() => () => "session"),
  getAuthorizationToken: jest.fn(() => () => ({
    expires: "expires",
    expiresIn: "expiresIn",
    token: "token",
  })),
}));

describe("performPasswordInit", () => {
  let getMockContext: any;

  beforeEach(() => {
    getMockContext = () => ({
      client: "client",
    });
  });

  test("should create a new session", async () => {
    await expect(
      performPasswordInit(getMockContext())({
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
