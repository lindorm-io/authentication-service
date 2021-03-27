import { EntityBase, EntityCreationError, IEntity, IEntityBaseOptions } from "@lindorm-io/entity";
import { GrantType, SessionEvent } from "../enum";
import { Scope } from "@lindorm-io/jwt";

export interface ISession extends IEntity {
  accountId: string;
  clientId: string;
  deviceId: string;
  expires: Date;
  grantType: GrantType;
  refreshId: string;
  scope: Array<Scope>;
}

export interface ISessionOptions extends IEntityBaseOptions {
  accountId: string;
  clientId: string;
  deviceId?: string;
  expires: Date;
  grantType: GrantType;
  refreshId: string;
  scope: Array<Scope>;
}

export class Session extends EntityBase implements ISession {
  private _accountId: string;
  private _clientId: string;
  private _deviceId: string;
  private _expires: Date;
  private _grantType: GrantType;
  private _refreshId: string;
  private _scope: Array<Scope>;

  constructor(options: ISessionOptions) {
    super(options);

    this._accountId = options.accountId;
    this._clientId = options.clientId;
    this._deviceId = options.deviceId || null;
    this._expires = options.expires;
    this._grantType = options.grantType;
    this._refreshId = options.refreshId;
    this._scope = options.scope;
  }

  public get accountId(): string {
    return this._accountId;
  }

  public get clientId(): string {
    return this._clientId;
  }

  public get deviceId(): string {
    return this._deviceId;
  }

  public get expires(): Date {
    return this._expires;
  }
  public set expires(expires: Date) {
    this._expires = expires;
    this.addEvent(SessionEvent.EXPIRES_CHANGED, { expires: this._expires });
  }

  public get grantType(): GrantType {
    return this._grantType;
  }

  public get refreshId(): string {
    return this._refreshId;
  }
  public set refreshId(refreshId: string) {
    this._refreshId = refreshId;
    this.addEvent(SessionEvent.REFRESH_ID_CHANGED, { refreshId: this._refreshId });
  }

  public get scope(): Array<Scope> {
    return this._scope;
  }

  public create(): void {
    for (const evt of this._events) {
      if (evt.name !== SessionEvent.CREATED) continue;
      throw new EntityCreationError("Session");
    }

    this.addEvent(SessionEvent.CREATED, {
      accountId: this._accountId,
      clientId: this._clientId,
      deviceId: this._deviceId,
      expires: this._expires,
      grantType: this._grantType,
      refreshId: this._refreshId,
      scope: this._scope,
    });
  }
}
