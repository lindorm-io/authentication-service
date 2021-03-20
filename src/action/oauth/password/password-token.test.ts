import { Account, IAccountOptions, Session } from "../../../entity";
import { MOCK_ACCOUNT_OPTIONS, MOCK_SESSION_OPTIONS, getMockRepository } from "../../../test/mocks";
import { GrantType } from "../../../enum";
import { performPasswordToken } from "./password-token";

jest.mock("../../../support", () => ({
  assertAccountPassword: jest.fn(() => undefined),
  authenticateSession: jest.fn(() => () => "session"),
  createTokens: jest.fn(() => () => "tokens"),
  findValidSession: jest.fn(() => () => new Session(MOCK_SESSION_OPTIONS)),
  getMultiFactorToken: jest.fn(() => () => "multi-factor-token"),
}));

describe("performPasswordToken", () => {
  let mockRepository: any;
  let getMockContext: any;

  beforeEach(() => {
    mockRepository = getMockRepository();
    getMockContext = () => ({
      client: "client",
      repository: mockRepository,
    });
  });

  test("should return tokens", async () => {
    await expect(
      performPasswordToken(getMockContext())({
        codeVerifier: "codeVerifier",
        grantType: GrantType.REFRESH_TOKEN,
        password: "password",
        subject: "email@lindorm.io",
      }),
    ).resolves.toBe("tokens");
  });

  test("should return multi-factor token", async () => {
    const context = getMockContext();
    const ctx = {
      ...context,
      repository: {
        ...context.repository,
        account: {
          ...context.repository.account,
          find: (filter: IAccountOptions) =>
            new Account({
              ...MOCK_ACCOUNT_OPTIONS,
              otp: { signature: "signature", uri: "uri" },
              ...filter,
            }),
        },
      },
    };

    await expect(
      performPasswordToken(ctx)({
        codeVerifier: "codeVerifier",
        grantType: GrantType.REFRESH_TOKEN,
        password: "password",
        subject: "email@lindorm.io",
      }),
    ).resolves.toMatchSnapshot();
  });
});
