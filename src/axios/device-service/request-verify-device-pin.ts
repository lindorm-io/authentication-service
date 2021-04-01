import { Account, Authorization } from "../../entity";
import { AuthType } from "@lindorm-io/axios/dist/enum";
import { ChallengeStrategy } from "../../enum";
import { IKoaAuthContext, IRequestChallengeVerifyData } from "../../typing";

export interface IRequestVerifyDevicePINOptions {
  account: Account;
  authorization: Authorization;
  certificateVerifier: string;
  pin: string;
}

export const requestVerifyDevicePIN = (ctx: IKoaAuthContext) => async (
  options: IRequestVerifyDevicePINOptions,
): Promise<IRequestChallengeVerifyData> => {
  const {
    axios: { device },
  } = ctx;
  const { account, certificateVerifier, pin, authorization } = options;

  const response = await device.post("/challenge/verify", {
    auth: AuthType.BASIC,
    data: {
      accountId: account.id,
      certificateVerifier,
      challengeId: authorization.challengeId,
      deviceId: authorization.deviceId,
      pin,
      strategy: ChallengeStrategy.PIN,
    },
  });
  const data: unknown = response.data;
  return data as IRequestChallengeVerifyData;
};
