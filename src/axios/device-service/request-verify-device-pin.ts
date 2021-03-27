import axios from "axios";
import { Account, Authorization } from "../../entity";
import { ChallengeStrategy } from "../../enum";
import { DEVICE_SERVICE_BASE_URL, DEVICE_SERVICE_BASIC_AUTH } from "../../config";
import { snakeKeys } from "@lindorm-io/core";

export interface IRequestVerifyDevicePINOptions {
  account: Account;
  authorization: Authorization;
  certificateVerifier: string;
  pin: string;
}

export const requestVerifyDevicePIN = async (options: IRequestVerifyDevicePINOptions): Promise<void> => {
  const url = new URL("/headless/challenge/verify", DEVICE_SERVICE_BASE_URL);
  const { account, certificateVerifier, pin, authorization } = options;

  await axios.post(
    url.toString(),
    snakeKeys({
      accountId: account.id,
      certificateVerifier,
      challengeId: authorization.challengeId,
      deviceId: authorization.deviceId,
      pin,
      strategy: ChallengeStrategy.PIN,
    }),
    {
      auth: DEVICE_SERVICE_BASIC_AUTH,
    },
  );
};
