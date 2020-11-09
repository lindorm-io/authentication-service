import { Client, IClient } from "../../entity";
import { IRepository, IRepositoryOptions, RepositoryBase } from "@lindorm-io/mongo";
import { MongoCollection } from "../../enum";
import { indices } from "./ClientRepository.indices";
import { schema } from "./ClientRepository.schema";

export interface IClientFilter {
  id?: string;
  approved?: boolean;
  name?: string;
}

export interface IClientRepository extends IRepository<Client> {
  create(client: Client): Promise<Client>;
  update(client: Client): Promise<Client>;
  find(filter: IClientFilter): Promise<Client>;
  findMany(filter: IClientFilter): Promise<Array<Client>>;
  remove(client: Client): Promise<void>;
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

  protected getEntityJSON(client: Client): IClient {
    return {
      id: client.id,
      version: client.version,
      created: client.created,
      updated: client.updated,
      events: client.events,

      name: client.name,
      description: client.description,
      secret: client.secret,
      approved: client.approved,
      emailAuthorizationUri: client.emailAuthorizationUri,
    };
  }

  public async create(client: Client): Promise<Client> {
    return super.create(client);
  }

  public async update(client: Client): Promise<Client> {
    return super.update(client);
  }

  public async find(filter: IClientFilter): Promise<Client> {
    return super.find(filter);
  }

  public async findMany(filter: IClientFilter): Promise<Array<Client>> {
    return super.findMany(filter);
  }

  public async remove(client: Client): Promise<void> {
    await super.remove(client);
  }
}
