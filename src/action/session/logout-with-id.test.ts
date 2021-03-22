import { logoutWithId } from "./logout-with-id";
import { baseHash } from "@lindorm-io/core";
import {
  getTestRepository,
  getTestAccount,
  getTestClient,
  getTestSession,
  inMemoryStore,
  resetStore,
} from "../../test";

jest.mock("uuid", () => ({
  v4: jest.fn(() => "be3a62d1-24a0-401c-96dd-3aff95356811"),
}));
jest.mock("../../support", () => ({
  assertAccountPermission: jest.fn(() => () => {}),
  encryptClientSecret: jest.fn((input) => baseHash(input)),
}));

describe("logoutWithId", () => {
  let ctx: any;

  beforeEach(async () => {
    ctx = {
      repository: await getTestRepository(),
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
    await expect(logoutWithId(ctx)({ sessionId: "be3a62d1-24a0-401c-96dd-3aff95356811" })).resolves.toBe(undefined);
    expect(inMemoryStore).toMatchSnapshot();
  });
});
