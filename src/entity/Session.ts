import { EntityBase, EntityCreationError, IEntity, IEntityBaseOptions, TObject } from "@lindorm-io/core";
import { SessionEvent } from "../enum";

export interface ISessionAgent {
  browser: string;
  geoIp: TObject<any>;
  os: string;
  platform: string;
  source: string;
  version: string;
}

export interface ISessionAuthorization {
  codeChallenge: string;
  codeMethod: string;
  deviceChallenge: string;
  email: string;
  id: string;
  otpCode: string;
  redirectUri: string;
  responseType: string;
}

export interface ISession extends IEntity {
  accountId: string;
  agent: ISessionAgent;
  authenticated: boolean;
  authorization: ISessionAuthorization;
  clientId: string;
  deviceId: string;
  expires: Date;
  grantType: string;
  refreshId: string;
  scope: string;
}

export interface ISessionOptions extends IEntityBaseOptions {
  accountId?: string;
  agent?: {
    browser?: string;
    geoIp?: TObject<any>;
    os?: string;
    platform?: string;
    source?: string;
    version?: string;
  };
  authenticated?: boolean;
  authorization: {
    codeChallenge: string;
    codeMethod: string;
    deviceChallenge?: string;
    email: string;
    id: string;
    otpCode?: string;
    redirectUri: string;
    responseType: string;
  };
  clientId: string;
  deviceId?: string;
  expires: Date;
  grantType: string;
  refreshId?: string;
  scope: string;
}

export class Session extends EntityBase implements ISession {
  private _accountId: string;
  private _agent: ISessionAgent;
  private _authenticated: boolean;
  private _authorization: ISessionAuthorization;
  private _clientId: string;
  private _deviceId: string;
  private _expires: Date;
  private _grantType: string;
  private _refreshId: string;
  private _scope: string;

  constructor(options: ISessionOptions) {
    super(options);

    this._accountId = options.accountId || null;
    this._agent = {
      browser: options.agent?.browser || null,
      geoIp: options.agent?.geoIp || null,
      os: options.agent?.os || null,
      platform: options.agent?.platform || null,
      source: options.agent?.source || null,
      version: options.agent?.version || null,
    };
    this._authenticated = options.authenticated || false;
    this._authorization = {
      codeChallenge: options.authorization.codeChallenge,
      codeMethod: options.authorization.codeMethod,
      deviceChallenge: options.authorization.deviceChallenge || null,
      email: options.authorization.email,
      id: options.authorization.id,
      otpCode: options.authorization.otpCode || null,
      redirectUri: options.authorization.redirectUri,
      responseType: options.authorization.responseType,
    };
    this._clientId = options.clientId;
    this._deviceId = options.deviceId || null;
    this._expires = options.expires;
    this._grantType = options.grantType;
    this._refreshId = options.refreshId || null;
    this._scope = options.scope;
  }

  public get accountId(): string {
    return this._accountId;
  }
  public set accountId(accountId: string) {
    this._accountId = accountId;
    this.addEvent(SessionEvent.ACCOUNT_ID_CHANGED, { accountId: this._accountId });
  }

  public get agent(): ISessionAgent {
    return this._agent;
  }

  public get authenticated(): boolean {
    return this._authenticated;
  }
  public set authenticated(authenticated: boolean) {
    this._authenticated = authenticated;
    this.addEvent(SessionEvent.AUTHENTICATED_CHANGED, { authenticated: this._authenticated });
  }

  public get authorization(): ISessionAuthorization {
    return this._authorization;
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

  public get grantType(): string {
    return this._grantType;
  }

  public get refreshId(): string {
    return this._refreshId;
  }
  public set refreshId(refreshId: string) {
    this._refreshId = refreshId;
    this.addEvent(SessionEvent.REFRESH_ID_CHANGED, { refreshId: this._refreshId });
  }

  public get scope(): string {
    return this._scope;
  }

  public create(): void {
    for (const evt of this._events) {
      if (evt.name !== SessionEvent.CREATED) continue;
      throw new EntityCreationError("Session");
    }

    this.addEvent(SessionEvent.CREATED, {
      accountId: this._accountId,
      agent: this._agent,
      authenticated: this._authenticated,
      authorization: this._authorization,
      clientId: this._clientId,
      deviceId: this._deviceId,
      expires: this._expires,
      grantType: this._grantType,
      refreshId: this._refreshId,
      scope: this._scope,
    });
  }
}
