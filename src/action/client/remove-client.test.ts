import { removeClient } from "./remove-client";
import { Client } from "@lindorm-io/koa-client";
import { getTestCache, getTestRepository, getTestAccount, inMemoryCache, inMemoryStore, logger } from "../../test";

jest.mock("uuid", () => ({
  v4: jest.fn(() => "be3a62d1-24a0-401c-96dd-3aff95356811"),
}));
jest.mock("../../support", () => ({
  assertAccountAdmin: jest.fn(() => () => {}),
}));

describe("removeClient", () => {
  let ctx: any;

  beforeEach(async () => {
    ctx = {
      account: getTestAccount("email@lindorm.io"),
      cache: await getTestCache(),
      logger,
      repository: await getTestRepository(),
    };

    const client = await ctx.repository.client.create(
      new Client({
        id: "0aa7b983-d62f-4778-ba90-36a3bda3ca0b",
      }),
    );
    await ctx.cache.client.create(client);
  });

  test("should remove client", async () => {
    await expect(removeClient(ctx)({ clientId: "0aa7b983-d62f-4778-ba90-36a3bda3ca0b" })).resolves.toBe(undefined);

    expect(inMemoryCache).toMatchSnapshot();
    expect(inMemoryStore).toMatchSnapshot();
  });
});
