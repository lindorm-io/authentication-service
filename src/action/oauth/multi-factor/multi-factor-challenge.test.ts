import { Client, InvalidClientError } from "@lindorm-io/koa-client";
import { MultiFactorChallengeType } from "../../../enum";
import { InvalidPermissionError, InvalidSubjectError } from "../../../error";
import { Permission } from "@lindorm-io/jwt";
import { performMultiFactorChallenge } from "./multi-factor-challenge";
import {
  getTestAccount,
  getTestAuthorization,
  getTestCache,
  getTestClient,
  getTestRepository,
  resetCache,
  resetStore,
} from "../../../test";

jest.mock("uuid", () => ({
  v4: jest.fn(() => "be3a62d1-24a0-401c-96dd-3aff95356811"),
}));
jest.mock("../../../support", () => ({
  assertAuthorizationIsNotExpired: jest.fn(() => {}),
}));

describe("performMultiFactorChallenge", () => {
  let ctx: any;

  beforeEach(async () => {
    ctx = {
      cache: await getTestCache(),
      client: getTestClient(false),
      repository: await getTestRepository(),
      token: {
        multiFactor: { subject: "4923fabc-aab2-4804-b92b-2aa96c4999a1" },
      },
    };

    await ctx.repository.account.create(getTestAccount("email@lindorm.io"));
    await ctx.cache.authorization.create(
      getTestAuthorization({
        client: ctx.client,
      }),
    );
  });

  afterEach(() => {
    resetCache();
    resetStore();
  });

  test("should return challenge data", async () => {
    await expect(
      performMultiFactorChallenge(ctx)({
        challengeType: MultiFactorChallengeType.OTP,
        subject: "email@lindorm.io",
      }),
    ).resolves.toMatchSnapshot();
  });

  test("should throw error on client mismatch", async () => {
    ctx.client = new Client({ id: "3af9b09e-51fa-4f84-9a47-e74bf0115148" });

    await expect(
      performMultiFactorChallenge(ctx)({
        challengeType: MultiFactorChallengeType.OTP,
        subject: "email@lindorm.io",
      }),
    ).rejects.toThrow(expect.any(InvalidClientError));
  });

  test("should throw error on subject mismatch", async () => {
    await expect(
      performMultiFactorChallenge(ctx)({
        challengeType: MultiFactorChallengeType.OTP,
        subject: "wrong@lindorm.io",
      }),
    ).rejects.toThrow(expect.any(InvalidSubjectError));
  });

  test("should throw error on locked account", async () => {
    const account = await ctx.repository.account.find({ email: "email@lindorm.io" });
    account.permission = Permission.LOCKED;
    await ctx.repository.account.update(account);

    await expect(
      performMultiFactorChallenge(ctx)({
        challengeType: MultiFactorChallengeType.OTP,
        subject: "email@lindorm.io",
      }),
    ).rejects.toStrictEqual(expect.any(InvalidPermissionError));
  });

  test("should throw error on unsupported challenge type", async () => {
    await expect(
      performMultiFactorChallenge(ctx)({
        challengeType: MultiFactorChallengeType.OOB,
        subject: "email@lindorm.io",
      }),
    ).rejects.toStrictEqual(
      expect.objectContaining({
        message: "Challenge type is not supported",
      }),
    );
  });
});
