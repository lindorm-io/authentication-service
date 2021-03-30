import { Account, Authorization } from "../../entity";
import { AuthType } from "@lindorm-io/axios/dist/enum";
import { ChallengeStrategy } from "../../enum";
import { IKoaAuthContext } from "../../typing";

export interface IRequestVerifyCertificateChallengeOptions {
  account: Account;
  authorization: Authorization;
  certificateVerifier: string;
}

export const requestVerifyCertificateChallenge = (ctx: IKoaAuthContext) => async (
  options: IRequestVerifyCertificateChallengeOptions,
): Promise<void> => {
  const {
    axios: { device },
  } = ctx;
  const { account, certificateVerifier, authorization } = options;

  await device.post("/headless/challenge/verify", {
    auth: AuthType.BASIC,
    data: {
      accountId: account.id,
      certificateVerifier,
      challengeId: authorization.challengeId,
      deviceId: authorization.deviceId,
      strategy: ChallengeStrategy.IMPLICIT,
    },
  });
};
