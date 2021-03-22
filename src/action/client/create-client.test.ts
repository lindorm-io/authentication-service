import MockDate from "mockdate";
import { baseHash } from "@lindorm-io/core";
import { createClient } from "./create-client";
import { getTestAccount, getTestCache, getTestRepository, inMemoryCache, inMemoryStore, logger } from "../../test";

jest.mock("uuid", () => ({
  v4: jest.fn(() => "be3a62d1-24a0-401c-96dd-3aff95356811"),
}));
jest.mock("../../support", () => ({
  assertAccountAdmin: jest.fn(() => () => {}),
  encryptClientSecret: jest.fn((input) => baseHash(input)),
}));

MockDate.set("2020-01-01 08:00:00.000");

describe("createClient", () => {
  let ctx: any;

  beforeEach(async () => {
    ctx = {
      account: getTestAccount("email@lindorm.io"),
      cache: await getTestCache(),
      logger,
      repository: await getTestRepository(),
    };
  });

  test("should create client", async () => {
    await expect(
      createClient(ctx)({
        description: "description",
        emailAuthorizationUri: "https://lindorm.io/",
        name: "name",
        secret: "45C409CEC3854E3E94500A55865370F5256AD872ED8A46FF8863AD87DB334EF8",
      }),
    ).resolves.toStrictEqual({
      clientId: "be3a62d1-24a0-401c-96dd-3aff95356811",
    });

    expect(inMemoryCache).toMatchSnapshot();
    expect(inMemoryStore).toMatchSnapshot();
  });
});
