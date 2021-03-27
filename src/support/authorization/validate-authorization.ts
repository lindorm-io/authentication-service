import { IKoaAuthContext } from "../../typing";
import { Authorization } from "../../entity";
import { assertAuthorizationIsNotExpired } from "./expires";
import { InvalidClientError } from "@lindorm-io/koa-client";
import { InvalidDeviceError, InvalidGrantTypeError, InvalidSubjectError } from "../../error";
import { assertCodeChallenge } from "./code-challenge";

export interface IValidateAuthorizationOptions {
  codeVerifier: string;
  email: string;
  grantType: string;
}

export const validateAuthorization = (ctx: IKoaAuthContext) => async (
  options: IValidateAuthorizationOptions,
): Promise<Authorization> => {
  const { cache, client, metadata, token } = ctx;
  const { codeVerifier, email, grantType } = options;
  const {
    authorization: { id: authorizationId },
  } = token;

  const authorization = await cache.authorization.find(authorizationId);

  try {
    assertAuthorizationIsNotExpired(authorization);

    if (authorization.clientId !== client.id) {
      throw new InvalidClientError(client.id);
    }

    if (authorization.deviceId !== metadata.deviceId) {
      throw new InvalidDeviceError(metadata.deviceId);
    }

    if (authorization.email !== email) {
      throw new InvalidSubjectError(email);
    }

    if (authorization.grantType !== grantType) {
      throw new InvalidGrantTypeError(grantType);
    }

    assertCodeChallenge(authorization, codeVerifier);

    return authorization;
  } catch (err) {
    await cache.authorization.remove(authorization);

    throw err;
  }
};
