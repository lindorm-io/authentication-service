import { IAccount, Account } from "../../entity";
import { IRepository, IRepositoryOptions, RepositoryBase } from "@lindorm-io/mongo";
import { MongoCollection } from "../../enum";
import { indices } from "./AccountRepository.indices";
import { schema } from "./AccountRepository.schema";

export interface IAccountFilter {
  id?: string;
  email?: string;
  permission?: string;
}

export interface IAccountRepository extends IRepository<Account> {
  create(account: Account): Promise<Account>;
  update(account: Account): Promise<Account>;
  find(filter: IAccountFilter): Promise<Account>;
  findMany(filter: IAccountFilter): Promise<Array<Account>>;
  remove(account: Account): Promise<void>;
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

  protected getEntityJSON(account: Account): IAccount {
    return {
      id: account.id,
      version: account.version,
      created: account.created,
      updated: account.updated,
      events: account.events,

      email: account.email,
      otp: account.otp,
      permission: account.permission,
      password: account.password,
    };
  }

  public async create(account: Account): Promise<Account> {
    return super.create(account);
  }

  public async update(account: Account): Promise<Account> {
    return super.update(account);
  }

  public async find(filter: IAccountFilter): Promise<Account> {
    return super.find(filter);
  }

  public async findMany(filter: IAccountFilter): Promise<Array<Account>> {
    return super.findMany(filter);
  }

  public async remove(account: Account): Promise<void> {
    await super.remove(account);
  }
}
