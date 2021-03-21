import { tokenValidationMiddleware } from "./token-validation-middleware";
import { winston } from "../logger";

describe("tokenValidationMiddleware", () => {
  let getMockContext: any;
  let next: any;

  beforeEach(() => {
    getMockContext = () => ({
      issuer: {
        tokenIssuer: {
          verify: (input: any) => input,
        },
      },
      logger: winston,
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
    });
    next = () => Promise.resolve();
  });

  test("should successfully set tokens on ctx", async () => {
    const ctx = getMockContext();

    await expect(tokenValidationMiddleware(ctx, next)).resolves.toBe(undefined);

    expect(ctx.token).toMatchSnapshot();
  });
});
