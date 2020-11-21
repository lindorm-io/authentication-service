import MockDate from "mockdate";
import { MOCK_LOGGER } from "../test/mocks";
import { repositoryMiddleware } from "./repository-middleware";
import { SessionRepository } from "../infrastructure/session";
import { AccountRepository } from "../infrastructure/account";
import { ClientRepository } from "@lindorm-io/koa-client";
import { DeviceRepository } from "../infrastructure/device";
import { KeyPairRepository } from "../infrastructure/key-pair";

MockDate.set("2020-01-01 08:00:00.000");

describe("repositoryMiddleware", () => {
  let ctx: any;
  let next: any;

  beforeEach(() => {
    ctx = {
      logger: MOCK_LOGGER,
      mongo: {
        getDatabase: jest.fn(() => ({
          databaseName: "databaseName",
        })),
      },
    };
    next = () => Promise.resolve();
  });

  test("should successfully set repositories on ctx", async () => {
    await expect(repositoryMiddleware(ctx, next)).resolves.toBe(undefined);

    expect(ctx.repository.account).toStrictEqual(expect.any(AccountRepository));
    expect(ctx.repository.client).toStrictEqual(expect.any(ClientRepository));
    expect(ctx.repository.device).toStrictEqual(expect.any(DeviceRepository));
    expect(ctx.repository.keyPair).toStrictEqual(expect.any(KeyPairRepository));
    expect(ctx.repository.session).toStrictEqual(expect.any(SessionRepository));
  });
});
