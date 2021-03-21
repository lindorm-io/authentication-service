import MockDate from "mockdate";
import { baseHash } from "@lindorm-io/core";
import { updateClient } from "./update-client";
import { Client } from "@lindorm-io/koa-client";
import {
  getTestAccount,
  getGreyBoxCache,
  getGreyBoxRepository,
  inMemoryCache,
  inMemoryStore,
  logger,
} from "../../test";

jest.mock("uuid", () => ({
  v4: jest.fn(() => "be3a62d1-24a0-401c-96dd-3aff95356811"),
}));
jest.mock("../../support", () => ({
  assertAccountAdmin: jest.fn(() => () => {}),
  encryptClientSecret: jest.fn((input) => baseHash(input)),
}));

MockDate.set("2020-01-01 08:00:00.000");

describe("updateClient", () => {
  let ctx: any;

  beforeEach(async () => {
    ctx = {
      account: getTestAccount("email@lindorm.io"),
      cache: await getGreyBoxCache(),
      logger,
      repository: await getGreyBoxRepository(),
    };

    const client = await ctx.repository.client.create(
      new Client({
        id: "0aa7b983-d62f-4778-ba90-36a3bda3ca0b",
      }),
    );
    await ctx.cache.client.create(client);
  });

  test("should update client", async () => {
    await expect(
      updateClient(ctx)({
        clientId: "0aa7b983-d62f-4778-ba90-36a3bda3ca0b",
        approved: true,
        description: "description",
        emailAuthorizationUri: "https://lindorm.io/",
        jwtAccessTokenExpiry: "10 minutes",
        jwtAuthorizationTokenExpiry: "20 minutes",
        jwtIdentityTokenExpiry: "30 minutes",
        jwtMultiFactorTokenExpiry: "40 minutes",
        jwtRefreshTokenExpiry: "50 minutes",
        name: "name",
        secret: "45C409CEC3854E3E94500A55865370F5256AD872ED8A46FF8863AD87DB334EF8",
      }),
    ).resolves.toBe(undefined);

    expect(inMemoryCache).toMatchSnapshot();
    expect(inMemoryStore).toMatchSnapshot();
  });
});
