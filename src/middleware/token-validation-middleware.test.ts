import { MOCK_CLIENT_OPTIONS } from "../test/mocks";
import { tokenValidationMiddleware } from "./token-validation-middleware";
import { Client } from "@lindorm-io/koa-client";
import { winston } from "../logger";

jest.mock("uuid", () => ({
  v4: jest.fn(() => "be3a62d1-24a0-401c-96dd-3aff95356811"),
}));

describe("tokenValidationMiddleware", () => {
  let getMockContext: any;
  let next: any;

  beforeEach(() => {
    getMockContext = () => ({
      client: new Client(MOCK_CLIENT_OPTIONS),
      issuer: {
        tokenIssuer: {
          verify: (input: any) => input,
        },
      },
      logger: winston,
      metadata: {
        deviceId: "deviceId",
      },
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
