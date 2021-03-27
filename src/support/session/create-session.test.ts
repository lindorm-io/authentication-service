import MockDate from "mockdate";
import { Account, Authorization } from "../../entity";
import { createSession } from "./create-session";
import {
  getTestAccount,
  getTestAuthorization,
  getTestCache,
  getTestClient,
  getTestRepository,
  inMemoryCache,
  inMemoryStore,
  resetCache,
  resetStore,
} from "../../test";

jest.mock("uuid", () => ({
  v4: jest.fn(() => "be3a62d1-24a0-401c-96dd-3aff95356811"),
}));
jest.mock("../../util", () => ({
  getExpiryDate: jest.fn(() => new Date()),
}));

MockDate.set("2020-01-01 08:00:00.000");

describe("createSession", () => {
  let ctx: any;
  let account: Account;
  let authorization: Authorization;

  beforeEach(async () => {
    ctx = {
      cache: await getTestCache(),
      client: getTestClient(),
      repository: await getTestRepository(),
    };
    account = getTestAccount("email@lindorm.io");
    authorization = await ctx.cache.authorization.create(
      getTestAuthorization({
        client: ctx.client,
      }),
    );
  });

  afterEach(() => {
    resetCache();
    resetStore();
  });

  test("should create a new session", async () => {
    await expect(createSession(ctx)({ account, authorization })).resolves.toMatchSnapshot();
    expect(inMemoryCache).toMatchSnapshot();
    expect(inMemoryStore).toMatchSnapshot();
  });
});
