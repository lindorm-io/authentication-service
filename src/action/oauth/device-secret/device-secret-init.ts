import Joi from "@hapi/joi";
import { ChallengeStrategy, GrantType } from "../../../enum";
import { IKoaAuthContext } from "../../../typing";
import { InvalidDeviceError } from "../../../error";
import { JOI_CODE_CHALLENGE, JOI_CODE_METHOD, JOI_EMAIL, JOI_STATE } from "../../../constant";
import { Scope } from "@lindorm-io/jwt";
import { assertValidResponseTypeInput, assertValidScopeInput } from "../../../util";
import { createAuthorization, getAuthorizationToken } from "../../../support";
import { requestCertificateChallenge } from "../../../axios";
import { stringComparison } from "@lindorm-io/core";

export interface IPerformDeviceSecretInitOptions {
  codeChallenge: string;
  codeMethod: string;
  deviceId: string;
  redirectUri: string;
  responseType: string;
  scope: string;
  state: string;
  subject: string;
}

export interface IPerformDeviceSecretInitData {
  certificateChallenge: string;
  expires: number;
  expiresIn: number;
  redirectUri: string;
  state: string;
  token: string;
}

const schema = Joi.object({
  codeChallenge: JOI_CODE_CHALLENGE,
  codeMethod: JOI_CODE_METHOD,
  deviceId: Joi.string().guid().required(),
  redirectUri: Joi.string().uri().required(),
  responseType: Joi.string().required(),
  scope: Joi.string().required(),
  state: JOI_STATE,
  subject: JOI_EMAIL,
});

export const performDeviceSecretInit = (ctx: IKoaAuthContext) => async (
  options: IPerformDeviceSecretInitOptions,
): Promise<IPerformDeviceSecretInitData> => {
  await schema.validateAsync(options);

  const { client, metadata, repository } = ctx;
  const { codeChallenge, codeMethod, deviceId, redirectUri, responseType, state, subject } = options;
  const scope = options.scope.split(" ") as Array<Scope>;

  if (!stringComparison(deviceId, metadata.deviceId)) {
    throw new InvalidDeviceError(deviceId);
  }

  assertValidResponseTypeInput(responseType);
  assertValidScopeInput(scope);

  const account = await repository.account.find({ email: subject });

  const { certificateChallenge, challengeId } = await requestCertificateChallenge(ctx)({
    account,
    deviceId,
    strategy: ChallengeStrategy.SECRET,
  });

  const authorization = await createAuthorization(ctx)({
    challengeId,
    codeChallenge,
    codeMethod,
    email: subject,
    grantType: GrantType.DEVICE_SECRET,
    redirectUri,
    responseType,
    scope,
  });

  const { expires, expiresIn, token } = getAuthorizationToken(ctx)({ authorization, client });

  return {
    certificateChallenge,
    expires,
    expiresIn,
    redirectUri,
    state,
    token,
  };
};
