import { EntityBase, IEntity, IEntityBaseOptions } from "@lindorm-io/core";
import { ClientEvent } from "../enum";

export interface IClient extends IEntity {
  approved: boolean;
  description: string;
  emailAuthorizationUri: string;
  name: string;
  secret: string;
}

export interface IClientOptions extends IEntityBaseOptions {
  approved?: boolean;
  description?: string;
  emailAuthorizationUri?: string;
  name?: string;
  secret?: string;
}

export class Client extends EntityBase implements IClient {
  private _approved: boolean;
  private _description: string;
  private _emailAuthorizationUri: string;
  private _name: string;
  private _secret: string;

  constructor(options?: IClientOptions) {
    super(options);
    this._approved = options?.approved || false;
    this._description = options?.description || null;
    this._emailAuthorizationUri = options?.emailAuthorizationUri || null;
    this._name = options?.name || null;
    this._secret = options?.secret || null;
  }

  public get approved(): boolean {
    return this._approved;
  }
  public set approved(approved: boolean) {
    this._approved = approved;
    this.addEvent(ClientEvent.APPROVED_CHANGED, { approved: this._approved });
  }

  public get emailAuthorizationUri(): string {
    return this._emailAuthorizationUri;
  }
  public set emailAuthorizationUri(uri: string) {
    this._emailAuthorizationUri = uri;
    this.addEvent(ClientEvent.EMAIL_AUTHORIZATION_URI_CHANGED, { uri: this._emailAuthorizationUri });
  }

  public get description(): string {
    return this._description;
  }
  public set description(description: string) {
    this._description = description;
    this.addEvent(ClientEvent.DESCRIPTION_CHANGED, { description: this._description });
  }

  public get name(): string {
    return this._name;
  }
  public set name(name: string) {
    this._name = name;
    this.addEvent(ClientEvent.NAME_CHANGED, { name: this._name });
  }

  public get secret(): string {
    return this._secret;
  }
  public set secret(secret: string) {
    this._secret = secret;
    this.addEvent(ClientEvent.SECRET_CHANGED, { secret: this._secret });
  }

  public create(): void {
    for (const evt of this._events) {
      if (evt.name !== ClientEvent.CREATED) continue;
      throw new Error("Client has already been created");
    }
    this.addEvent(ClientEvent.CREATED, {
      name: this._name,
      emailAuthorizationUri: this._emailAuthorizationUri,
      approved: this._approved,
      description: this._description,
      secret: this._secret,
      created: this._created,
      updated: this._updated,
    });
  }
}
