import { Account, IAccountOptions, ISessionOptions, Session } from "../../../entity";
import { GrantType } from "../../../enum";
import { Permission } from "@lindorm-io/jwt";
import { InvalidPermissionError, InvalidSubjectError } from "../../../error";
import { performMultiFactorToken } from "./multi-factor-token";
import {
  MOCK_ACCOUNT_OPTIONS,
  MOCK_CLIENT_OPTIONS,
  MOCK_SESSION_OPTIONS,
  getMockRepository,
} from "../../../test/mocks";
import { Client, InvalidClientError } from "@lindorm-io/koa-client";

jest.mock("uuid", () => ({
  v4: jest.fn(() => "be3a62d1-24a0-401c-96dd-3aff95356811"),
}));
jest.mock("../../../support", () => ({
  assertAccountOTP: jest.fn(() => undefined),
  assertSessionIsNotExpired: jest.fn(() => undefined),
  authenticateSession: jest.fn(() => () => "session"),
  createTokens: jest.fn(() => () => "tokens"),
}));

describe("performMultiFactorToken", () => {
  let mockRepository: any;
  let getMockContext: any;

  beforeEach(() => {
    mockRepository = getMockRepository();
    mockRepository.session.find = (filter: ISessionOptions) =>
      new Session({
        ...MOCK_SESSION_OPTIONS,
        refreshId: "refreshId",
        ...filter,
      });

    getMockContext = () => ({
      client: new Client({
        ...MOCK_CLIENT_OPTIONS,
        id: "clientId",
      }),
      repository: mockRepository,
      token: {
        multiFactor: { authMethodsReference: "authMethodsReference", subject: "sessionId" },
      },
    });
  });

  test("should return tokens", async () => {
    await expect(
      performMultiFactorToken(getMockContext())({
        bindingCode: "bindingCode",
        grantType: GrantType.REFRESH_TOKEN,
        subject: "email@lindorm.io",
      }),
    ).resolves.toMatchSnapshot();
  });

  test("should throw error on client mismatch", async () => {
    const context = getMockContext();
    const ctx = {
      ...context,
      client: new Client(),
    };

    await expect(
      performMultiFactorToken(ctx)({
        bindingCode: "bindingCode",
        grantType: GrantType.REFRESH_TOKEN,
        subject: "email@lindorm.io",
      }),
    ).rejects.toStrictEqual(expect.any(InvalidClientError));
  });

  test("should throw error on subject mismatch", async () => {
    await expect(
      performMultiFactorToken(getMockContext())({
        bindingCode: "bindingCode",
        grantType: GrantType.REFRESH_TOKEN,
        subject: "wrong@lindorm.io",
      }),
    ).rejects.toStrictEqual(expect.any(InvalidSubjectError));
  });

  test("should throw error on locked account", async () => {
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
      performMultiFactorToken(ctx)({
        bindingCode: "bindingCode",
        grantType: GrantType.REFRESH_TOKEN,
        subject: "email@lindorm.io",
      }),
    ).rejects.toStrictEqual(expect.any(InvalidPermissionError));
  });
});
