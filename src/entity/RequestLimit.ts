import { EntityBase, IEntity, IEntityBaseOptions } from "@lindorm-io/core";
import { GrantType } from "../enum";

export interface IRequestLimit extends IEntity {
  backOffUntil: Date;
  failedTries: number;
  grantType: GrantType;
  subject: string;
}

export interface IRequestLimitOptions extends IEntityBaseOptions {
  backOffUntil?: Date;
  failedTries?: number;
  grantType: GrantType;
  subject: string;
}

export class RequestLimit extends EntityBase implements IRequestLimit {
  private _backOffUntil: Date;
  private _failedTries: number;
  private _grantType: GrantType;
  private _subject: string;

  constructor(options: IRequestLimitOptions) {
    super(options);
    this._backOffUntil = options.backOffUntil || null;
    this._failedTries = options.failedTries || 1;
    this._grantType = options.grantType;
    this._subject = options.subject;
  }

  public get backOffUntil(): Date {
    return this._backOffUntil;
  }
  public set backOffUntil(backOffUntil: Date) {
    this._backOffUntil = backOffUntil;
    this._updated = new Date();
  }

  public get failedTries(): number {
    return this._failedTries;
  }
  public set failedTries(failedTries: number) {
    this._failedTries = failedTries;
    this._updated = new Date();
  }

  public get grantType(): GrantType {
    return this._grantType;
  }

  public get subject(): string {
    return this._subject;
  }

  public create(): void {
    /* intentionally left empty */
  }
}
