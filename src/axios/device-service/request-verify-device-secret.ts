import { Account, Authorization } from "../../entity";
import { AuthType } from "@lindorm-io/axios/dist/enum";
import { ChallengeStrategy } from "../../enum";
import { IKoaAuthContext } from "../../typing";

export interface IRequestVerifyDeviceSecretOptions {
  account: Account;
  authorization: Authorization;
  certificateVerifier: string;
  secret: string;
}

export const requestVerifyDeviceSecret = (ctx: IKoaAuthContext) => async (
  options: IRequestVerifyDeviceSecretOptions,
): Promise<void> => {
  const {
    axios: { device },
  } = ctx;
  const { account, certificateVerifier, secret, authorization } = options;

  await device.post("/headless/challenge/verify", {
    auth: AuthType.BASIC,
    data: {
      accountId: account.id,
      certificateVerifier,
      challengeId: authorization.challengeId,
      deviceId: authorization.deviceId,
      secret,
      strategy: ChallengeStrategy.SECRET,
    },
  });
};
