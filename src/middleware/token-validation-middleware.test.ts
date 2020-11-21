import { Device } from "../entity";
import { MOCK_CLIENT_OPTIONS, MOCK_DEVICE_OPTIONS, MOCK_LOGGER } from "../test/mocks";
import { tokenValidationMiddleware } from "./token-validation-middleware";
import { Client } from "@lindorm-io/koa-client";

jest.mock("uuid", () => ({
  v4: jest.fn(() => "be3a62d1-24a0-401c-96dd-3aff95356811"),
}));

describe("tokenValidationMiddleware", () => {
  let getMockContext: any;
  let next: any;

  beforeEach(() => {
    getMockContext = () => ({
      client: new Client(MOCK_CLIENT_OPTIONS),
      device: new Device(MOCK_DEVICE_OPTIONS),
      issuer: {
        tokenIssuer: {
          verify: (input: any) => input,
        },
      },
      logger: MOCK_LOGGER,
      request: {
        body: {
          authorizationToken: "authorizationToken",
          multiFactorToken: "multiFactorToken",
          refreshToken: "refreshToken",
        },
      },
    });
    next = () => Promise.resolve();
  });

  test("should successfully set tokens on ctx", async () => {
    const ctx = getMockContext();

    await expect(tokenValidationMiddleware(ctx, next)).resolves.toBe(undefined);

    expect(ctx.token).toMatchSnapshot();
  });
});
