import { tokenValidationMiddleware } from "./token-validation-middleware";
import { logger } from "../test";

const next = jest.fn();

describe("tokenValidationMiddleware", () => {
  let ctx: any;

  beforeEach(() => {
    ctx = {
      issuer: {
        auth: {
          verify: (input: any) => input,
        },
      },
      logger,
      metadata: {
        clientId: "clientId",
        deviceId: "deviceId",
      },
      request: {
        body: {
          authorizationToken: "authorizationToken",
          multiFactorToken: "multiFactorToken",
          refreshToken: "refreshToken",
        },
      },
    };
  });

  test("should successfully set tokens on ctx", async () => {
    await expect(tokenValidationMiddleware(ctx, next)).resolves.toBe(undefined);

    expect(ctx.token).toMatchSnapshot();
  });
});
