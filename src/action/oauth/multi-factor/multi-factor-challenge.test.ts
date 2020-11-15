import { Account, Client, IAccountOptions, ISessionOptions, Session } from "../../../entity";
import { GrantType, MultiFactorChallengeType } from "../../../enum";
import { Permission } from "@lindorm-io/jwt";
import { InvalidClientError, InvalidPermissionError, InvalidSubjectError } from "../../../error";
import { performMultiFactorChallenge } from "./multi-factor-challenge";
import {
  MOCK_ACCOUNT_OPTIONS,
  MOCK_CLIENT_OPTIONS,
  MOCK_SESSION_OPTIONS,
  getMockRepository,
} from "../../../test/mocks";

jest.mock("uuid", () => ({
  v4: jest.fn(() => "be3a62d1-24a0-401c-96dd-3aff95356811"),
}));
jest.mock("../../../support", () => ({
  assertSessionIsNotExpired: jest.fn(() => undefined),
}));

describe("performMultiFactorChallenge", () => {
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
        multiFactor: { subject: "sessionId" },
      },
    });
  });

  test("should return challenge data", async () => {
    await expect(
      performMultiFactorChallenge(getMockContext())({
        challengeType: MultiFactorChallengeType.OTP,
        grantType: GrantType.REFRESH_TOKEN,
        subject: "email@lindorm.io",
      }),
    ).resolves.toStrictEqual({
      bindingMethod: "prompt",
      challengeType: "otp",
    });
  });

  test("should throw error on client mismatch", async () => {
    const context = getMockContext();
    const ctx = {
      ...context,
      client: new Client(),
    };

    await expect(
      performMultiFactorChallenge(ctx)({
        challengeType: MultiFactorChallengeType.OTP,
        grantType: GrantType.REFRESH_TOKEN,
        subject: "email@lindorm.io",
      }),
    ).rejects.toStrictEqual(expect.any(InvalidClientError));
  });

  test("should throw error on subject mismatch", async () => {
    await expect(
      performMultiFactorChallenge(getMockContext())({
        challengeType: MultiFactorChallengeType.OTP,
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
      performMultiFactorChallenge(ctx)({
        challengeType: MultiFactorChallengeType.OTP,
        grantType: GrantType.REFRESH_TOKEN,
        subject: "email@lindorm.io",
      }),
    ).rejects.toStrictEqual(expect.any(InvalidPermissionError));
  });

  test("should throw error on unsupported challenge type", async () => {
    await expect(
      performMultiFactorChallenge(getMockContext())({
        challengeType: MultiFactorChallengeType.OOB,
        grantType: GrantType.REFRESH_TOKEN,
        subject: "email@lindorm.io",
      }),
    ).rejects.toStrictEqual(
      expect.objectContaining({
        message: "Challenge type is not supported",
      }),
    );
  });
});
