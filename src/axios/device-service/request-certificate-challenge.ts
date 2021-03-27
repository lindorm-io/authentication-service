import axios from "axios";
import { Account } from "../../entity";
import { DEVICE_SERVICE_BASE_URL, DEVICE_SERVICE_BASIC_AUTH } from "../../config";
import { camelKeys, snakeKeys } from "@lindorm-io/core";
import { ChallengeStrategy } from "../../enum";

export interface IRequestCertificateChallengeOptions {
  account: Account;
  deviceId: string;
  strategy: ChallengeStrategy;
}

export interface IRequestCertificateChallengeData {
  challengeId: string;
  certificateChallenge: string;
}

export const requestCertificateChallenge = async (
  options: IRequestCertificateChallengeOptions,
): Promise<IRequestCertificateChallengeData> => {
  const url = new URL("/headless/challenge/initialise", DEVICE_SERVICE_BASE_URL);
  const { account, deviceId, strategy } = options;
  const accountId = account.id;

  const response = await axios.post(
    url.toString(),
    snakeKeys({
      accountId,
      deviceId,
      strategy,
    }),
    {
      auth: DEVICE_SERVICE_BASIC_AUTH,
    },
  );

  return camelKeys(response?.data || {}) as IRequestCertificateChallengeData;
};
