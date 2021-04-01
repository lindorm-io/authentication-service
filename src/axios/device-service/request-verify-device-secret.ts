import { Account, Authorization } from "../../entity";
import { AuthType } from "@lindorm-io/axios/dist/enum";
import { ChallengeStrategy } from "../../enum";
import { IKoaAuthContext, IRequestChallengeVerifyData } from "../../typing";

export interface IRequestVerifyDeviceSecretOptions {
  account: Account;
  authorization: Authorization;
  certificateVerifier: string;
  secret: string;
}

export const requestVerifyDeviceSecret = (ctx: IKoaAuthContext) => async (
  options: IRequestVerifyDeviceSecretOptions,
): Promise<IRequestChallengeVerifyData> => {
  const {
    axios: { device },
  } = ctx;
  const { account, certificateVerifier, secret, authorization } = options;

  const response = await device.post("/challenge/verify", {
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
  const data: unknown = response.data;
  return data as IRequestChallengeVerifyData;
};
