import axios from "axios";
import { Account, Authorization } from "../../entity";
import { ChallengeStrategy } from "../../enum";
import { DEVICE_SERVICE_BASE_URL, DEVICE_SERVICE_BASIC_AUTH } from "../../config";
import { snakeKeys } from "@lindorm-io/core";

export interface IRequestVerifyCertificateChallengeOptions {
  account: Account;
  authorization: Authorization;
  certificateVerifier: string;
}

export const requestVerifyCertificateChallenge = async (
  options: IRequestVerifyCertificateChallengeOptions,
): Promise<void> => {
  const url = new URL("/headless/challenge/verify", DEVICE_SERVICE_BASE_URL);
  const { account, certificateVerifier, authorization } = options;

  await axios.post(
    url.toString(),
    snakeKeys({
      accountId: account.id,
      certificateVerifier,
      challengeId: authorization.challengeId,
      deviceId: authorization.deviceId,
      strategy: ChallengeStrategy.IMPLICIT,
    }),
    {
      auth: DEVICE_SERVICE_BASIC_AUTH,
    },
  );
};
