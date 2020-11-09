import MockDate from "mockdate";
import { MOCK_LOGGER } from "../test/mocks";
import { repositoryMiddleware } from "./repository-middleware";

MockDate.set("2020-01-01 08:00:00.000");

jest.mock("../repository", () => ({
  AccountRepository: class Repository {
    public mock: boolean;
    constructor() {
      this.mock = true;
    }
  },
  ClientRepository: class Repository {
    public mock: boolean;
    constructor() {
      this.mock = true;
    }
  },
  DeviceRepository: class Repository {
    public mock: boolean;
    constructor() {
      this.mock = true;
    }
  },
  KeyPairRepository: class Repository {
    public mock: boolean;
    constructor() {
      this.mock = true;
    }
  },
  SessionRepository: class Repository {
    public mock: boolean;
    constructor() {
      this.mock = true;
    }
  },
}));

describe("repositoryMiddleware", () => {
  let getMockContext: any;
  let next: any;

  beforeEach(() => {
    getMockContext = () => ({
      logger: MOCK_LOGGER,
      mongo: {
        db: () => "db",
        disconnect: (): any => undefined,
      },
    });

    next = () => Promise.resolve();
  });

  test("should successfully set repositories on ctx", async () => {
    const ctx = getMockContext();

    await expect(repositoryMiddleware(ctx, next)).resolves.toBe(undefined);

    expect(ctx.repository).toStrictEqual({
      account: expect.objectContaining({
        mock: true,
      }),
      client: expect.objectContaining({
        mock: true,
      }),
      device: expect.objectContaining({
        mock: true,
      }),
      keyPair: expect.objectContaining({
        mock: true,
      }),
      session: expect.objectContaining({
        mock: true,
      }),
    });
  });
});
