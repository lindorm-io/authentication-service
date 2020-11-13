import { MOCK_ACCOUNT_OPTIONS, MOCK_SESSION_OPTIONS, getMockRepository } from "../../../test/mocks";
import { GrantType, Permission, ResponseType } from "../../../enum";
import { Account, IAccountOptions, Session } from "../../../entity";
import { performRefreshToken } from "./refresh-token";
import { InvalidPermissionError, InvalidRefreshTokenError, InvalidSubjectError } from "../../../error";

jest.mock("../../../support", () => ({
  createTokens: jest.fn(() => () => "tokens"),
  extendSession: jest.fn(() => () => new Session(MOCK_SESSION_OPTIONS)),
}));

describe("performRefreshToken", () => {
  let mockRepository: any;
  let getMockContext: any;

  beforeEach(() => {
    mockRepository = getMockRepository();
    getMockContext = () => ({
      client: "client",
      repository: mockRepository,
      token: { refresh: { authMethodsReference: "authMethodsReference", permission: Permission.USER } },
    });
  });

  test("should return tokens", async () => {
    await expect(
      performRefreshToken(getMockContext())({
        grantType: GrantType.REFRESH_TOKEN,
        responseType: ResponseType.REFRESH,
        subject: "email@lindorm.io",
      }),
    ).resolves.toBe("tokens");
  });

  test("should throw error when account is locked", async () => {
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
              permission: Permission.LOCKED,
              ...filter,
            }),
        },
      },
    };

    await expect(
      performRefreshToken(ctx)({
        grantType: GrantType.REFRESH_TOKEN,
        responseType: ResponseType.REFRESH,
        subject: "email@lindorm.io",
      }),
    ).rejects.toStrictEqual(expect.any(InvalidPermissionError));
  });

  test("should throw error when permission is mismatched", async () => {
    const context = getMockContext();
    const ctx = {
      ...context,
      token: {
        ...context.token,
        refresh: {
          ...context.token.refresh,
          permission: "permission",
        },
      },
    };

    await expect(
      performRefreshToken(ctx)({
        grantType: GrantType.REFRESH_TOKEN,
        responseType: ResponseType.REFRESH,
        subject: "email@lindorm.io",
      }),
    ).rejects.toStrictEqual(expect.any(InvalidRefreshTokenError));
  });

  test("should throw error when email is mismatched", async () => {
    await expect(
      performRefreshToken(getMockContext())({
        grantType: GrantType.REFRESH_TOKEN,
        responseType: ResponseType.REFRESH,
        subject: "wrong@lindorm.io",
      }),
    ).rejects.toStrictEqual(expect.any(InvalidSubjectError));
  });
});
