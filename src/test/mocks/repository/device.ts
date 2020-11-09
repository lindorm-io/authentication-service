import { Device, IDeviceOptions } from "../../../entity";
import { MOCK_RSA_PUBLIC_KEY } from "../keys";

export const MOCK_DEVICE_OPTIONS: IDeviceOptions = {
  accountId: "accountId",
  publicKey: MOCK_RSA_PUBLIC_KEY,
};

export const mockRepositoryDevice = {
  create: jest.fn((entity: Device) => entity),
  update: jest.fn((entity: Device) => entity),
  find: jest.fn((filter: IDeviceOptions) => new Device({ ...MOCK_DEVICE_OPTIONS, ...filter })),
  findMany: jest.fn((filter: IDeviceOptions) => [new Device({ ...MOCK_DEVICE_OPTIONS, ...filter })]),
  remove: jest.fn((): any => undefined),
};
