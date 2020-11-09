import Joi from "@hapi/joi";
import { IAuthContext } from "../../typing";
import {
  IGetAccountDevicesData,
  IGetAccountSessionsData,
  getAccount,
  getAccountDevices,
  getAccountSessions,
} from "../../support";

export interface IGetAccountInformationOptions {
  accountId: string;
}

export interface IGetAccountInformationData {
  created: Date;
  devices: Array<IGetAccountDevicesData>;
  email: string;
  hasOtp: boolean;
  hasPassword: boolean;
  permission: string;
  sessions: Array<IGetAccountSessionsData>;
  updated: Date;
}

const schema = Joi.object({
  accountId: Joi.string().guid().required(),
});

export const getAccountInformation = (ctx: IAuthContext) => async (
  options: IGetAccountInformationOptions,
): Promise<IGetAccountInformationData> => {
  await schema.validateAsync(options);

  const { logger } = ctx;
  const { accountId } = options;

  logger.info("requesting account information", { id: accountId });

  const account = await getAccount(ctx)(accountId);
  const devices = await getAccountDevices(ctx)(account);
  const sessions = await getAccountSessions(ctx)(account);

  return {
    created: account.created,
    devices,
    email: account.email,
    hasOtp: !!account.otp.uri,
    hasPassword: !!account.password.signature,
    permission: account.permission,
    sessions,
    updated: account.updated,
  };
};
