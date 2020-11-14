import { CacheBase, ICache, ICacheOptions } from "@lindorm-io/redis";
import { IRequestLimit, RequestLimit } from "../../entity";
import { schema } from "./schema";

export interface IGetKeyOptions {
  grantType: string;
  subject: string;
}

export interface IRequestLimitCache extends ICache<RequestLimit> {
  create(entity: RequestLimit): Promise<RequestLimit>;
  find(id: string): Promise<RequestLimit>;
  findAll(): Promise<Array<RequestLimit>>;
  remove(entity: RequestLimit): Promise<void>;
}

export class RequestLimitCache extends CacheBase<RequestLimit> implements IRequestLimitCache {
  constructor(options: ICacheOptions) {
    super({
      client: options.client,
      entityName: RequestLimit.constructor.name,
      expiresInSeconds: options.expiresInSeconds,
      logger: options.logger,
      schema,
    });
  }

  protected createEntity(data: IRequestLimit): RequestLimit {
    return new RequestLimit(data);
  }

  protected getEntityJSON(entity: RequestLimit): IRequestLimit {
    return {
      id: entity.id,
      version: entity.version,
      created: entity.created,
      updated: entity.updated,
      events: entity.events,

      backOffUntil: entity.backOffUntil,
      failedTries: entity.failedTries,
      grantType: entity.grantType,
      subject: entity.subject,
    };
  }

  protected getEntityKey(entity: RequestLimit): string {
    return RequestLimitCache.getKey(entity);
  }

  public async create(entity: RequestLimit): Promise<RequestLimit> {
    return super.create(entity);
  }

  public async find(id: string): Promise<RequestLimit> {
    return super.find(id);
  }

  public async findAll(): Promise<Array<RequestLimit>> {
    return super.findAll();
  }

  public async remove(entity: RequestLimit): Promise<void> {
    await super.remove(entity);
  }

  public static getKey(options: IGetKeyOptions): string {
    return `${options.grantType}::${options.subject}`;
  }
}
