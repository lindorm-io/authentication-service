import Joi from "@hapi/joi";
import { APIError } from "@lindorm-io/errors";
import { HttpStatus } from "@lindorm-io/core";
import { IKoaAuthContext } from "../../../typing";
import { InvalidClientError } from "@lindorm-io/koa-client";
import { InvalidPermissionError, InvalidSubjectError } from "../../../error";
import { JOI_CHALLENGE_TYPE, JOI_EMAIL } from "../../../constant";
import { MultiFactorChallengeType } from "../../../enum";
import { assertAuthorizationIsNotExpired } from "../../../support";
import { isLocked } from "@lindorm-io/jwt";

export interface IPerformMultiFactorChallengeOptions {
  authenticatorId?: string;
  challengeType: string;
  subject: string;
}

export interface IPerformMultiFactorChallengeData {
  bindingMethod?: string;
  challengeType: string;
  oobCode?: string;
}

const schema = Joi.object({
  authenticatorId: Joi.string(),
  challengeType: JOI_CHALLENGE_TYPE,
  subject: JOI_EMAIL,
});

export const performMultiFactorChallenge = (ctx: IKoaAuthContext) => async (
  options: IPerformMultiFactorChallengeOptions,
): Promise<IPerformMultiFactorChallengeData> => {
  await schema.validateAsync(options);

  const { cache, client, repository, token } = ctx;
  const { challengeType, subject } = options;
  const {
    multiFactor: { subject: authorizationId },
  } = token;

  const authorization = await cache.authorization.find(authorizationId);

  assertAuthorizationIsNotExpired(authorization);

  if (authorization.clientId !== client.id) {
    throw new InvalidClientError(client.id);
  }

  if (authorization.email !== subject) {
    throw new InvalidSubjectError(subject);
  }

  const account = await repository.account.find({ email: subject });

  if (isLocked(account.permission)) {
    throw new InvalidPermissionError();
  }

  switch (challengeType) {
    case MultiFactorChallengeType.OTP:
      return {
        challengeType,
        bindingMethod: "prompt",
      };

    case MultiFactorChallengeType.OOB:
      throw new APIError("Challenge type is not supported", {
        statusCode: HttpStatus.ClientError.FORBIDDEN,
      });

    default:
      throw new APIError("Unknown challenge type", {
        statusCode: HttpStatus.ClientError.FORBIDDEN,
      });
  }
};
