import { IRepository, IRepositoryOptions, RepositoryBase } from "@lindorm-io/mongo";
import { ISession, Session } from "../../entity";
import { MongoCollection } from "../../enum";
import { indices } from "./SessionRepository.indices";
import { schema } from "./SessionRepository.schema";

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
  create(session: Session): Promise<Session>;
  update(session: Session): Promise<Session>;
  find(filter: ISessionFilter): Promise<Session>;
  findMany(filter: ISessionFilter): Promise<Array<Session>>;
  remove(session: Session): Promise<void>;
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

  protected getEntityJSON(session: Session): ISession {
    return {
      id: session.id,
      version: session.version,
      created: session.created,
      updated: session.updated,
      events: session.events,

      accountId: session.accountId,
      agent: session.agent,
      authenticated: session.authenticated,
      authorization: session.authorization,
      clientId: session.clientId,
      deviceId: session.deviceId,
      expires: session.expires,
      grantType: session.grantType,
      refreshId: session.refreshId,
      scope: session.scope,
    };
  }

  public async create(session: Session): Promise<Session> {
    return super.create(session);
  }

  public async find(filter: ISessionFilter): Promise<Session> {
    return super.find(filter);
  }

  public async findMany(filter: ISessionFilter): Promise<Array<Session>> {
    return super.findMany(filter);
  }

  public async remove(session: Session): Promise<void> {
    await super.remove(session);
  }
}
