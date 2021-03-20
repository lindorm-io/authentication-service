import { IAccount, Account } from "../../entity";
import { IRepository, IRepositoryOptions, RepositoryBase } from "@lindorm-io/mongo";
import { MongoCollection } from "../../enum";
import { indices } from "./indices";
import { schema } from "./schema";

export interface IAccountFilter {
  id?: string;
  email?: string;
  permission?: string;
}

export interface IAccountRepository extends IRepository<Account> {
  create(entity: Account): Promise<Account>;
  update(entity: Account): Promise<Account>;
  find(filter: IAccountFilter): Promise<Account>;
  findMany(filter: IAccountFilter): Promise<Array<Account>>;
  findOrCreate(filter: IAccountFilter): Promise<Account>;
  remove(entity: Account): Promise<void>;
}

export class AccountRepository extends RepositoryBase<Account> implements IAccountRepository {
  constructor(options: IRepositoryOptions) {
    super({
      collectionName: MongoCollection.ACCOUNT,
      db: options.db,
      logger: options.logger,
      indices,
      schema,
    });
  }

  protected createEntity(data: IAccount): Account {
    return new Account(data);
  }

  protected getEntityJSON(entity: Account): IAccount {
    return {
      id: entity.id,
      version: entity.version,
      created: entity.created,
      updated: entity.updated,
      events: entity.events,

      email: entity.email,
      identityLinked: entity.identityLinked,
      otp: entity.otp,
      permission: entity.permission,
      password: entity.password,
    };
  }

  public async create(entity: Account): Promise<Account> {
    return super.create(entity);
  }

  public async update(entity: Account): Promise<Account> {
    return super.update(entity);
  }

  public async find(filter: IAccountFilter): Promise<Account> {
    return super.find(filter);
  }

  public async findMany(filter: IAccountFilter): Promise<Array<Account>> {
    return super.findMany(filter);
  }

  public async findOrCreate(filter: IAccountFilter): Promise<Account> {
    return super.findOrCreate(filter);
  }

  public async remove(entity: Account): Promise<void> {
    await super.remove(entity);
  }
}
