import { CacheBase, ICache, ICacheOptions } from "@lindorm-io/redis";
import { IClient, Client } from "../../entity";
import { schema } from "../../repository/client/schema";

export interface IClientCache extends ICache<Client> {
  create(entity: Client): Promise<Client>;
  update(entity: Client): Promise<Client>;
  find(id: string): Promise<Client>;
  findAll(): Promise<Array<Client>>;
  remove(entity: Client): Promise<void>;
}

export class ClientCache extends CacheBase<Client> implements IClientCache {
  constructor(options: ICacheOptions) {
    super({
      client: options.client,
      entityName: Client.constructor.name,
      expiresInSeconds: options.expiresInSeconds,
      logger: options.logger,
      schema,
    });
  }

  protected createEntity(data: IClient): Client {
    return new Client(data);
  }

  protected getEntityJSON(entity: Client): IClient {
    return {
      id: entity.id,
      version: entity.version,
      created: entity.created,
      updated: entity.updated,
      events: entity.events,

      name: entity.name,
      description: entity.description,
      secret: entity.secret,
      approved: entity.approved,
      emailAuthorizationUri: entity.emailAuthorizationUri,
    };
  }

  protected getEntityKey(entity: Client): string {
    return entity.id;
  }

  public async create(entity: Client): Promise<Client> {
    return super.create(entity);
  }

  public async update(entity: Client): Promise<Client> {
    return super.update(entity);
  }

  public async find(id: string): Promise<Client> {
    return super.find(id);
  }

  public async findAll(): Promise<Array<Client>> {
    return super.findAll();
  }

  public async remove(entity: Client): Promise<void> {
    await super.remove(entity);
  }
}
