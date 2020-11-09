import { Device, IDevice } from "../../entity";
import { IRepository, IRepositoryOptions, RepositoryBase } from "@lindorm-io/mongo";
import { MongoCollection } from "../../enum";
import { indices } from "./DeviceRepository.indices";
import { schema } from "./DeviceRepository.schema";

export interface IDeviceFilter {
  id?: string;
  accountId?: string;
  name?: string;
}

export interface IDeviceRepository extends IRepository<Device> {
  create(device: Device): Promise<Device>;
  update(device: Device): Promise<Device>;
  find(filter: IDeviceFilter): Promise<Device>;
  findMany(filter: IDeviceFilter): Promise<Array<Device>>;
  remove(device: Device): Promise<void>;
}

export class DeviceRepository extends RepositoryBase<Device> implements IDeviceRepository {
  constructor(options: IRepositoryOptions) {
    super({
      collectionName: MongoCollection.DEVICE,
      db: options.db,
      logger: options.logger,
      indices,
      schema,
    });
  }

  protected createEntity(data: IDevice): Device {
    return new Device(data);
  }

  protected getEntityJSON(device: Device): IDevice {
    return {
      id: device.id,
      version: device.version,
      created: device.created,
      updated: device.updated,
      events: device.events,

      accountId: device.accountId,
      name: device.name,
      pin: device.pin,
      publicKey: device.publicKey,
      secret: device.secret,
    };
  }

  public async create(device: Device): Promise<Device> {
    return super.create(device);
  }

  public async update(device: Device): Promise<Device> {
    return super.update(device);
  }

  public async find(filter: IDeviceFilter): Promise<Device> {
    return super.find(filter);
  }

  public async findMany(filter: IDeviceFilter): Promise<Array<Device>> {
    return super.findMany(filter);
  }

  public async remove(device: Device): Promise<void> {
    await super.remove(device);
  }
}
