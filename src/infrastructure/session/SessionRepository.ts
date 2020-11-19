import { IRepository, IRepositoryOptions, RepositoryBase } from "@lindorm-io/mongo";
import { ISession, Session } from "../../entity";
import { MongoCollection } from "../../enum";
import { indices } from "./indices";
import { schema } from "./schema";

export interface ISessionFilter {
  id?: string;
  accountId?: string;
  authenticated?: boolean;
  clientId?: string;
  deviceId?: string;
  expires?: Date;
  grantType?: string;
  refreshId?: string;
}

export interface ISessionRepository extends IRepository<Session> {
  create(entity: Session): Promise<Session>;
  update(entity: Session): Promise<Session>;
  find(filter: ISessionFilter): Promise<Session>;
  findMany(filter: ISessionFilter): Promise<Array<Session>>;
  findOrCreate(filter: ISessionFilter): Promise<Session>;
  remove(entity: Session): Promise<void>;
}

export class SessionRepository extends RepositoryBase<Session> implements ISessionRepository {
  constructor(options: IRepositoryOptions) {
    super({
      collectionName: MongoCollection.SESSION,
      db: options.db,
      logger: options.logger,
      indices,
      schema,
    });
  }

  protected createEntity(data: ISession): Session {
    return new Session(data);
  }

  protected getEntityJSON(entity: Session): ISession {
    return {
      id: entity.id,
      version: entity.version,
      created: entity.created,
      updated: entity.updated,
      events: entity.events,

      accountId: entity.accountId,
      agent: entity.agent,
      authenticated: entity.authenticated,
      authorization: entity.authorization,
      clientId: entity.clientId,
      deviceId: entity.deviceId,
      expires: entity.expires,
      grantType: entity.grantType,
      refreshId: entity.refreshId,
      scope: entity.scope,
    };
  }

  public async create(entity: Session): Promise<Session> {
    return super.create(entity);
  }

  public async find(filter: ISessionFilter): Promise<Session> {
    return super.find(filter);
  }

  public async findMany(filter: ISessionFilter): Promise<Array<Session>> {
    return super.findMany(filter);
  }

  public async remove(entity: Session): Promise<void> {
    await super.remove(entity);
  }
}
