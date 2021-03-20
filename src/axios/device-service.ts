import axios from "axios";
import { Account, Session } from "../entity";
import { DEVICE_SERVICE_BASIC_AUTH, DEVICE_SERVICE_BASE_URL } from "../config";

export interface IVerifyDevicePINOptions {
  account: Account;
  deviceVerifier: string;
  pin: string;
  session: Session;
}

export const verifyDevicePIN = async (options: IVerifyDevicePINOptions): Promise<void> => {
  const url = new URL(`/headless/verify-pin`, DEVICE_SERVICE_BASE_URL);
  const { account, deviceVerifier, pin, session } = options;

  await axios.post(
    url.toString(),
    {
      account_id: account.id,
      device_challenge: session.authorization.deviceChallenge,
      device_id: session.deviceId,
      device_verifier: deviceVerifier,
      pin,
    },
    {
      auth: DEVICE_SERVICE_BASIC_AUTH,
    },
  );
};

export interface IVerifyDeviceSecretOptions {
  account: Account;
  deviceVerifier: string;
  secret: string;
  session: Session;
}

export const verifyDeviceSecret = async (options: IVerifyDeviceSecretOptions): Promise<void> => {
  const url = new URL(`/headless/verify-secret`, DEVICE_SERVICE_BASE_URL);
  const { account, deviceVerifier, secret, session } = options;

  await axios.post(
    url.toString(),
    {
      account_id: account.id,
      device_challenge: session.authorization.deviceChallenge,
      device_id: session.deviceId,
      device_verifier: deviceVerifier,
      secret,
    },
    {
      auth: DEVICE_SERVICE_BASIC_AUTH,
    },
  );
};
