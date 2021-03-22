import { logoutWithToken } from "./logout-with-token";
import {
  getTestRepository,
  getTestAccount,
  getTestClient,
  getTestSession,
  inMemoryStore,
  resetStore,
} from "../../test";
import { baseHash } from "@lindorm-io/core";

jest.mock("uuid", () => ({
  v4: jest.fn(() => "be3a62d1-24a0-401c-96dd-3aff95356811"),
}));
jest.mock("../../support", () => ({
  assertAccountPermission: jest.fn(() => () => {}),
  encryptClientSecret: jest.fn((input) => baseHash(input)),
}));

describe("logoutWithToken", () => {
  let ctx: any;

  beforeEach(async () => {
    ctx = {
      repository: await getTestRepository(),
      token: { refresh: { subject: "be3a62d1-24a0-401c-96dd-3aff95356811" } },
    };
    await ctx.repository.session.create(
      getTestSession(
        getTestAccount("email@lindorm.io"),
        getTestClient(),
        "H4LnTn7e1DltMsohJgIeKSNgpvppJ1qP6QRRD9Ai1pw=",
        "sha256",
      ),
    );
  });

  afterEach(resetStore);

  test("should log out", async () => {
    await expect(logoutWithToken(ctx)({ refreshToken: "token.token.token" })).resolves.toBe(undefined);
    expect(inMemoryStore).toMatchSnapshot();
  });
});
