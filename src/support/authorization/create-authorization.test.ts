import MockDate from "mockdate";
import { GrantType, ResponseType } from "../../enum";
import { Scope } from "@lindorm-io/jwt";
import { baseHash } from "@lindorm-io/core";
import { getTestClient, inMemoryCache, resetCache, getTestCache } from "../../test";
import { createAuthorization } from "./create-authorization";

jest.mock("uuid", () => ({
  v4: jest.fn(() => "591ec96f-2e9f-4c54-8da2-ee982a373935"),
}));
jest.mock("./otp", () => ({
  encryptAuthorizationOTP: jest.fn((input) => baseHash(input)),
}));
jest.mock("../../util", () => ({
  getExpiryDate: jest.fn(() => new Date()),
}));

MockDate.set("2020-01-01 08:00:00.000");

describe("createSession", () => {
  let ctx: any;

  beforeEach(async () => {
    ctx = {
      cache: await getTestCache(),
      client: getTestClient(),
      metadata: { deviceId: "2122b49f-3dc0-46c2-9a8b-6cec5e26a389" },
    };
  });

  afterEach(resetCache);

  test("should create a new authorization", async () => {
    await expect(
      createAuthorization(ctx)({
        challengeId: "f00cad5c-fc34-43bf-837d-b60b81605dda",
        codeChallenge: "H4LnTn7e1DltMsohJgIeKSNgpvppJ1qP6QRRD9Ai1pw=",
        codeMethod: "sha256",
        email: "email@lindorm.io",
        grantType: GrantType.DEVICE_PIN,
        otpCode: "otpCode",
        redirectUri: "https://lindorm.io",
        responseType: ResponseType.ACCESS,
        scope: [Scope.DEFAULT],
      }),
    ).resolves.toMatchSnapshot();

    expect(inMemoryCache).toMatchSnapshot();
  });

  test("should create a new authorization without optional values", async () => {
    ctx.metadata.deviceId = undefined;

    await expect(
      createAuthorization(ctx)({
        codeChallenge: "H4LnTn7e1DltMsohJgIeKSNgpvppJ1qP6QRRD9Ai1pw=",
        codeMethod: "sha256",
        email: "email@lindorm.io",
        grantType: GrantType.DEVICE_PIN,
        redirectUri: "https://lindorm.io",
        responseType: ResponseType.ACCESS,
        scope: [Scope.DEFAULT],
      }),
    ).resolves.toMatchSnapshot();

    expect(inMemoryCache).toMatchSnapshot();
  });
});
