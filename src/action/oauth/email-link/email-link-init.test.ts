import { GrantType, ResponseType } from "../../../enum";
import { Scope } from "@lindorm-io/jwt";
import { performEmailLinkInit } from "./email-link-init";

jest.mock("../../../util", () => ({
  assertValidResponseTypeInput: jest.fn(),
  assertValidScopeInput: jest.fn(),
}));
jest.mock("../../../support", () => ({
  createAuthorization: jest.fn(() => () => "createAuthorization"),
  getAuthorizationToken: jest.fn(() => () => ({
    expires: "expires",
    expiresIn: "expiresIn",
    token: "token",
  })),
  sendEmailLink: jest.fn(() => () => {}),
}));

describe("performEmailLinkInit", () => {
  let ctx: any;

  beforeEach(() => {
    ctx = {
      client: "client",
    };
  });

  test("should create a new session", async () => {
    await expect(
      performEmailLinkInit(ctx)({
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
