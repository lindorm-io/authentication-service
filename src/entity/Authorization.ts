import { EntityBase, IEntity, IEntityBaseOptions } from "@lindorm-io/entity";
import { GrantType } from "../enum";
import { Scope } from "@lindorm-io/jwt";

export interface IAuthorization extends IEntity {
  challengeId: string;
  clientId: string;
  codeChallenge: string;
  codeMethod: string;
  deviceId: string;
  email: string;
  expires: Date;
  grantType: GrantType;
  otpCode: string;
  redirectUri: string;
  responseType: string;
  scope: Array<Scope>;
}

export interface IAuthorizationOptions extends IEntityBaseOptions {
  challengeId?: string;
  clientId: string;
  codeChallenge: string;
  codeMethod: string;
  deviceId?: string;
  email: string;
  expires: Date;
  grantType: GrantType;
  otpCode?: string;
  redirectUri: string;
  responseType: string;
  scope: Array<Scope>;
}

export class Authorization extends EntityBase implements IAuthorization {
  readonly challengeId: string;
  readonly clientId: string;
  readonly codeChallenge: string;
  readonly codeMethod: string;
  readonly deviceId: string;
  readonly email: string;
  readonly expires: Date;
  readonly grantType: GrantType;
  readonly otpCode: string;
  readonly redirectUri: string;
  readonly responseType: string;
  readonly scope: Array<Scope>;

  constructor(options: IAuthorizationOptions) {
    super(options);

    this.challengeId = options.challengeId || null;
    this.clientId = options.clientId;
    this.codeChallenge = options.codeChallenge;
    this.codeMethod = options.codeMethod;
    this.deviceId = options.deviceId || null;
    this.email = options.email;
    this.expires = options.expires;
    this.grantType = options.grantType;
    this.otpCode = options.otpCode || null;
    this.redirectUri = options.redirectUri;
    this.responseType = options.responseType;
    this.scope = options.scope;
  }

  public create(): void {
    /* intentionally left empty */
  }
}
