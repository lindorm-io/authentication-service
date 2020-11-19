import { Client, IClient } from "../../entity";
import { IRepository, IRepositoryOptions, RepositoryBase } from "@lindorm-io/mongo";
import { MongoCollection } from "../../enum";
import { indices } from "./indices";
import { schema } from "./schema";

export interface IClientFilter {
  id?: string;
  approved?: boolean;
  name?: string;
}

export interface IClientRepository extends IRepository<Client> {
  create(entity: Client): Promise<Client>;
  update(entity: Client): Promise<Client>;
  find(filter: IClientFilter): Promise<Client>;
  findMany(filter: IClientFilter): Promise<Array<Client>>;
  findOrCreate(filter: IClientFilter): Promise<Client>;
  remove(entity: Client): Promise<void>;
}

export class ClientRepository extends RepositoryBase<Client> implements IClientRepository {
  constructor(options: IRepositoryOptions) {
    super({
      collectionName: MongoCollection.CLIENT,
      db: options.db,
      logger: options.logger,
      indices,
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

  public async create(entity: Client): Promise<Client> {
    return super.create(entity);
  }

  public async update(entity: Client): Promise<Client> {
    return super.update(entity);
  }

  public async find(filter: IClientFilter): Promise<Client> {
    return super.find(filter);
  }

  public async findMany(filter: IClientFilter): Promise<Array<Client>> {
    return super.findMany(filter);
  }

  public async remove(entity: Client): Promise<void> {
    await super.remove(entity);
  }
}
