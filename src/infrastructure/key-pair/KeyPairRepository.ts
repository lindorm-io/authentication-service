import { IKeyPair, KeyPair } from "@lindorm-io/key-pair";
import { IRepository, IRepositoryOptions, RepositoryBase } from "@lindorm-io/mongo";
import { MongoCollection } from "../../enum";
import { indices } from "./indices";
import { schema } from "./schema";

export interface IKeyPairFilter {
  id?: string;
  algorithm?: string;
  type?: string;
}

export interface IKeyPairRepository extends IRepository<KeyPair> {
  create(entity: KeyPair): Promise<KeyPair>;
  update(entity: KeyPair): Promise<KeyPair>;
  find(entity: IKeyPairFilter): Promise<KeyPair>;
  findMany(filter: IKeyPairFilter): Promise<Array<KeyPair>>;
  findOrCreate(entity: IKeyPairFilter): Promise<KeyPair>;
  remove(entity: KeyPair): Promise<void>;
}

export class KeyPairRepository extends RepositoryBase<KeyPair> implements IKeyPairRepository {
  constructor(options: IRepositoryOptions) {
    super({
      collectionName: MongoCollection.KEY_PAIR,
      db: options.db,
      logger: options.logger,
      indices,
      schema,
    });
  }

  protected createEntity(data: IKeyPair): KeyPair {
    return new KeyPair(data);
  }

  protected getEntityJSON(entity: KeyPair): IKeyPair {
    return {
      id: entity.id,
      version: entity.version,
      created: entity.created,
      updated: entity.updated,
      events: entity.events,

      allowed: entity.allowed,
      algorithm: entity.algorithm,
      expires: entity.expires,
      passphrase: entity.passphrase,
      privateKey: entity.privateKey,
      publicKey: entity.publicKey,
      type: entity.type,
    };
  }

  public async create(entity: KeyPair): Promise<KeyPair> {
    return super.create(entity);
  }

  public async update(entity: KeyPair): Promise<KeyPair> {
    return super.update(entity);
  }

  public async find(filter: IKeyPairFilter): Promise<KeyPair> {
    return super.find(filter);
  }

  public async findMany(filter: IKeyPairFilter): Promise<Array<KeyPair>> {
    return super.findMany(filter);
  }

  public async remove(entity: KeyPair): Promise<void> {
    await super.remove(entity);
  }
}
