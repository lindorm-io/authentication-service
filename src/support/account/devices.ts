import { IAuthContext } from "../../typing";
import { orderBy } from "lodash";
import { Account } from "../../entity";

export interface IGetAccountDevicesData {
  created: Date;
  id: string;
  name: string;
  updated: Date;
}

export const getAccountDevices = (ctx: IAuthContext) => async (
  account: Account,
): Promise<Array<IGetAccountDevicesData>> => {
  const { repository } = ctx;

  const devices = await repository.device.findMany({ accountId: account.id });
  const deviceArray = [];

  for (const device of devices) {
    deviceArray.push({
      created: device.created,
      id: device.id,
      name: device.name,
      updated: device.updated,
    });
  }

  return orderBy(deviceArray, ["name", "updated"], ["asc", "desc"]);
};
