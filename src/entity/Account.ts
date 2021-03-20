import { AccountEvent } from "../enum";
import { EntityBase, EntityCreationError, IEntity, IEntityBaseOptions } from "@lindorm-io/core";
import { Permission } from "@lindorm-io/jwt";

export interface IAccountOTP {
  signature: string;
  uri: string;
}

export interface IAccountPassword {
  signature: string;
  updated: Date;
}

export interface IAccount extends IEntity {
  email: string;
  identityLinked: boolean;
  otp: IAccountOTP;
  password: IAccountPassword;
  permission: string;
}

export interface IAccountOptions extends IEntityBaseOptions {
  email: string;
  identityLinked?: boolean;
  otp?: IAccountOTP;
  password?: IAccountPassword;
  permission?: string;
}

export class Account extends EntityBase implements IAccount {
  private _email: string;
  private _identityLinked: boolean;
  private _otp: IAccountOTP;
  private _password: IAccountPassword;
  private _permission: string;

  constructor(options: IAccountOptions) {
    super(options);
    this._email = options.email.toLowerCase();
    this._identityLinked = options.identityLinked || false;
    this._otp = {
      signature: options.otp?.signature || null,
      uri: options.otp?.uri || null,
    };
    this._password = {
      signature: options.password?.signature || null,
      updated: options.password?.updated || null,
    };
    this._permission = options.permission || Permission.USER;
  }

  public get email(): string {
    return this._email;
  }
  public set email(email: string) {
    this._email = email.toLowerCase();
    this.addEvent(AccountEvent.EMAIL_CHANGED, { email: this._email });
  }

  public get identityLinked(): boolean {
    return this._identityLinked;
  }
  public set identityLinked(identityLinked: boolean) {
    this._identityLinked = identityLinked;
    this.addEvent(AccountEvent.EMAIL_CHANGED, { identityLinked: this._identityLinked });
  }

  public get otp(): IAccountOTP {
    return this._otp;
  }
  public set otp(otp: IAccountOTP) {
    this._otp = otp;
    this.addEvent(AccountEvent.OTP_CHANGED, { otp: this._otp });
  }

  public get password(): IAccountPassword {
    return this._password;
  }
  public set password(password: IAccountPassword) {
    this._password = password;
    this.addEvent(AccountEvent.PASSWORD_CHANGED, { password: this._password });
  }

  public get permission(): string {
    return this._permission;
  }
  public set permission(permission: string) {
    this._permission = permission;
    this.addEvent(AccountEvent.PERMISSION_CHANGED, { permission: this._permission });
  }

  public create(): void {
    for (const evt of this._events) {
      if (evt.name !== AccountEvent.CREATED) continue;
      throw new EntityCreationError("Account");
    }
    this.addEvent(AccountEvent.CREATED, {
      email: this._email,
      permission: this._permission,
      password: this._password,
      otp: this._otp,
      created: this._created,
      updated: this._updated,
    });
  }
}
