import MockDate from "mockdate";
import { Client } from "../entity";
import { InvalidClientError, RejectedClientError } from "../error";
import { MOCK_CLIENT_OPTIONS, MOCK_LOGGER, MOCK_UUID, getMockRepository } from "../test/mocks";
import { clientMiddleware } from "./client-middleware";

jest.mock("uuid", () => ({
  v4: jest.fn(() => "be3a62d1-24a0-401c-96dd-3aff95356811"),
}));

jest.mock("../support", () => ({
  assertClientSecret: jest.fn(() => undefined),
}));

MockDate.set("2020-01-01 08:00:00.000");

describe("clientMiddleware", () => {
  let getMockContext: any;
  let next: any;

  beforeEach(() => {
    getMockContext = () => ({
      logger: MOCK_LOGGER,
      repository: getMockRepository(),
      request: {
        body: { clientId: MOCK_UUID, clientSecret: "secret" },
      },
    });

    next = () => Promise.resolve();
  });

  test("should successfully set client on ctx", async () => {
    const ctx = getMockContext();

    await expect(clientMiddleware(ctx, next)).resolves.toBe(undefined);

    expect(ctx.client).toMatchSnapshot();
    expect(ctx.metrics.client).toStrictEqual(expect.any(Number));
  });

  test("should not validate secret when missing from client", async () => {
    const context = getMockContext();
    const ctx = {
      ...context,
      repository: {
        ...context.repository,
        client: {
          ...context.repository.client,
          find: jest.fn(
            () =>
              new Client({
                ...MOCK_CLIENT_OPTIONS,
                id: MOCK_UUID,
                secret: null,
              }),
          ),
        },
      },
    };

    await expect(clientMiddleware(ctx, next)).resolves.toBe(undefined);

    expect(ctx.client).toMatchSnapshot();
  });

  test("should throw error on missing client", async () => {
    const context = getMockContext();
    const ctx = {
      ...context,
      repository: {
        ...context.repository,
        client: {
          ...context.repository.client,
          find: jest.fn(() => {
            throw new Error();
          }),
        },
      },
    };

    await expect(clientMiddleware(ctx, next)).rejects.toStrictEqual(expect.any(InvalidClientError));
  });

  test("should throw error on rejected client", async () => {
    const context = getMockContext();
    const ctx = {
      ...context,
      repository: {
        ...context.repository,
        client: {
          ...context.repository.client,
          find: jest.fn(
            () =>
              new Client({
                ...MOCK_CLIENT_OPTIONS,
                id: MOCK_UUID,
                approved: false,
              }),
          ),
        },
      },
    };

    await expect(clientMiddleware(ctx, next)).rejects.toStrictEqual(expect.any(RejectedClientError));
  });
});
