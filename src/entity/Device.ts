import { EntityBase, IEntity, IEntityBaseOptions } from "@lindorm-io/core";
import { DeviceEvent } from "../enum";

export interface IDevicePIN {
  signature: string;
  updated: Date;
}

export interface IDevice extends IEntity {
  accountId: string;
  name: string;
  pin: IDevicePIN;
  publicKey: string;
  secret: string;
}

export interface IDeviceOptions extends IEntityBaseOptions {
  accountId: string;
  name?: string;
  pin?: IDevicePIN;
  publicKey: string;
  secret?: string;
}

export class Device extends EntityBase implements IDevice {
  private _accountId: string;
  private _name: string;
  private _pin: IDevicePIN;
  private _publicKey: string;
  private _secret: string;

  constructor(options: IDeviceOptions) {
    super(options);
    this._accountId = options.accountId;
    this._name = options.name || null;
    this._pin = {
      signature: options.pin?.signature || null,
      updated: options.pin?.updated || null,
    };
    this._publicKey = options.publicKey;
    this._secret = options.secret || null;
  }

  public get accountId(): string {
    return this._accountId;
  }

  public get name(): string {
    return this._name;
  }
  public set name(name: string) {
    this._name = name;
    this.addEvent(DeviceEvent.NAME_CHANGED, { name: this._name });
  }

  public get pin(): IDevicePIN {
    return this._pin;
  }
  public set pin(pin: IDevicePIN) {
    this._pin = pin;
    this.addEvent(DeviceEvent.PIN_CHANGED, { pin: this._pin });
  }

  public get publicKey(): string {
    return this._publicKey;
  }

  public get secret(): string {
    return this._secret;
  }
  public set secret(secret: string) {
    this._secret = secret;
    this.addEvent(DeviceEvent.SECRET_CHANGED, { secret: this._secret });
  }

  public create(): void {
    for (const evt of this._events) {
      if (evt.name !== DeviceEvent.CREATED) continue;
      throw new Error("Device has already been created");
    }
    this.addEvent(DeviceEvent.CREATED, {
      accountId: this._accountId,
      name: this._name,
      pin: this._pin,
      publicKey: this._publicKey,
      secret: this._secret,
      created: this._created,
      updated: this._updated,
    });
  }
}
