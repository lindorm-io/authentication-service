import MockDate from "mockdate";
import { Account } from "../../entity";
import { MOCK_ACCOUNT_OPTIONS } from "../../test/mocks";
import { getRandomValue } from "@lindorm-io/core";
import { updateClient } from "./update-client";
import { winston } from "../../logger";
import { getGreyBoxCache, getGreyBoxRepository, inMemoryCache, inMemoryStore } from "../../test";
import { Client } from "@lindorm-io/koa-client";

jest.mock("uuid", () => ({
  v4: jest.fn(() => "be3a62d1-24a0-401c-96dd-3aff95356811"),
}));
jest.mock("../../support", () => ({
  assertAccountAdmin: jest.fn(() => () => undefined),
  encryptClientSecret: jest.fn(
    () =>
      "VTJGc2RHVmtYMTlNcTVzT1hJMGlaUlZaMXZrQWZWWDVPcUpaY0tqT29hN05KR3h2VkplQko0M0JFNnVmbGVsVk1tMnI3RmlwNllPK05HQ2V1QnJZaWZabXJVbTMrVHRvSHFaM0xvOGNKM3l3NFNZdlg3U0VrUHA3MjdMQTdlVkg4czFaUzB6VTJzMTBra0Yxdko3RzgybENNd0k4T1hZU0ZOVkZwVkZ5SnhabUllSURLQlRmdDdZT1JLa2JsNzRhZUV5eDBSZ1BBeTFqYzR0d2w0NFYzUT09",
  ),
}));

MockDate.set("2020-01-01 08:00:00.000");

describe("updateClient", () => {
  let ctx: any;

  beforeEach(async () => {
    ctx = {
      account: new Account(MOCK_ACCOUNT_OPTIONS),
      cache: await getGreyBoxCache(),
      logger: winston,
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
        secret: getRandomValue(32),
      }),
    ).resolves.toBe(undefined);

    expect(inMemoryCache).toMatchSnapshot();
    expect(inMemoryStore).toMatchSnapshot();
  });
});
