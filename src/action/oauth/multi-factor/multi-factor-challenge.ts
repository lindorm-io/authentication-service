import Joi from "@hapi/joi";
import { APIError, HttpStatus } from "@lindorm-io/core";
import { IAuthContext } from "../../../typing";
import { InvalidClientError } from "@lindorm-io/koa-client";
import { InvalidPermissionError, InvalidSubjectError } from "../../../error";
import { JOI_CHALLENGE_TYPE, JOI_EMAIL, JOI_GRANT_TYPE } from "../../../constant";
import { MultiFactorChallengeType } from "../../../enum";
import { assertSessionIsNotExpired } from "../../../support";
import { isLocked } from "@lindorm-io/jwt";

export interface IPerformMultiFactorChallengeOptions {
  authenticatorId?: string;
  challengeType: string;
  grantType: string;
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
  grantType: JOI_GRANT_TYPE,
  subject: JOI_EMAIL,
});

export const performMultiFactorChallenge = (ctx: IAuthContext) => async (
  options: IPerformMultiFactorChallengeOptions,
): Promise<IPerformMultiFactorChallengeData> => {
  await schema.validateAsync(options);

  const { client, repository, token } = ctx;
  const { challengeType, subject } = options;
  const {
    multiFactor: { subject: sessionId },
  } = token;

  const session = await repository.session.find({ id: sessionId });

  assertSessionIsNotExpired(session);

  if (session.clientId !== client.id) {
    throw new InvalidClientError(client.id);
  }

  if (session.authorization.email !== subject) {
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
