import { ResponseType } from "../../../enum";
import { Scope } from "@lindorm-io/jwt";
import { getTestAccount, getTestMetadata, getTestRepository } from "../../../test";
import { performDeviceSecretInit } from "./device-secret-init";
import { Account } from "../../../entity";

jest.mock("../../../axios", () => ({
  requestCertificateChallenge: jest.fn(() => () => ({
    certificateChallenge: "certificateChallenge",
    challengeId: "3b96cd46-26f0-417d-b293-e82457800142",
  })),
}));
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
}));

describe("performDeviceSecretInit", () => {
  let ctx: any;
  let account: Account;

  beforeEach(async () => {
    ctx = {
      client: "client",
      metadata: getTestMetadata(),
      repository: await getTestRepository(),
    };

    account = await ctx.repository.account.create(getTestAccount("email@lindorm.io"));
  });

  test("should create a new session", async () => {
    await expect(
      performDeviceSecretInit(ctx)({
        deviceId: "4a8c6c97-6155-4ddf-b02f-696cf0ec8dd5",
        codeChallenge: "Z1teIWMlf6xFacp4quXP3O0XI204ZT1b",
        codeMethod: "sha512",
        redirectUri: "https://redirect.uri/",
        responseType: ResponseType.REFRESH,
        scope: Scope.DEFAULT,
        state: "1bVcJqZ1pBeqVLxV",
        subject: account.email,
      }),
    ).resolves.toMatchSnapshot();
  });
});
