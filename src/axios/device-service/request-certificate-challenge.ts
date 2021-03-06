import { Account } from "../../entity";
import { AuthType } from "@lindorm-io/axios/dist/enum";
import { ChallengeStrategy } from "../../enum";
import { IKoaAuthContext } from "../../typing";
import { ChallengeScope } from "../../enum/challenge-scope";

export interface IRequestCertificateChallengeOptions {
  account: Account;
  deviceId: string;
  strategy: ChallengeStrategy;
}

export interface IRequestCertificateChallengeData {
  challengeId: string;
  certificateChallenge: string;
}

export const requestCertificateChallenge = (ctx: IKoaAuthContext) => async (
  options: IRequestCertificateChallengeOptions,
): Promise<IRequestCertificateChallengeData> => {
  const {
    axios: { device },
  } = ctx;
  const { account, deviceId, strategy } = options;
  const accountId = account.id;

  const response = await device.post("/challenge/initialise", {
    auth: AuthType.BASIC,
    data: {
      accountId,
      deviceId,
      scope: ChallengeScope.SIGN_IN,
      strategy,
    },
  });
  const data: unknown = response.data;

  return data as IRequestCertificateChallengeData;
};
