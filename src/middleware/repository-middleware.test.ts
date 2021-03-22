import MockDate from "mockdate";
import { repositoryMiddleware } from "./repository-middleware";
import { AccountRepository, SessionRepository } from "../infrastructure";
import { logger } from "../test";
import { getTestMongo } from "../test/grey-box/test-mongo";

MockDate.set("2020-01-01 08:00:00.000");

const next = jest.fn();

describe("repositoryMiddleware", () => {
  let ctx: any;

  beforeEach(async () => {
    ctx = {
      logger,
      mongo: await getTestMongo(),
    };
  });

  test("should successfully set repositories on ctx", async () => {
    await expect(repositoryMiddleware(ctx, next)).resolves.toBe(undefined);

    expect(ctx.repository.account).toStrictEqual(expect.any(AccountRepository));
    expect(ctx.repository.session).toStrictEqual(expect.any(SessionRepository));
  });
});
