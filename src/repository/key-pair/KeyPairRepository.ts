import { IKeyPair, KeyPair } from "@lindorm-io/key-pair";
import { IRepository, IRepositoryOptions, RepositoryBase } from "@lindorm-io/mongo";
import { MongoCollection } from "../../enum";
import { indices } from "./KeyPairRepository.indices";
import { schema } from "./KeyPairRepository.schema";

export interface IKeyPairFilter {
  id?: string;
  algorithm?: string;
  type?: string;
}

export interface IKeyPairRepository extends IRepository<KeyPair> {
  create(keyPair: KeyPair): Promise<KeyPair>;
  update(keyPair: KeyPair): Promise<KeyPair>;
  find(keyPair: IKeyPairFilter): Promise<KeyPair>;
  findMany(filter: IKeyPairFilter): Promise<Array<KeyPair>>;
  remove(keyPair: KeyPair): Promise<void>;
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

  protected getEntityJSON(keyPair: KeyPair): IKeyPair {
    return {
      id: keyPair.id,
      version: keyPair.version,
      created: keyPair.created,
      updated: keyPair.updated,
      events: keyPair.events,

      algorithm: keyPair.algorithm,
      expires: keyPair.expires,
      passphrase: keyPair.passphrase,
      privateKey: keyPair.privateKey,
      publicKey: keyPair.publicKey,
      type: keyPair.type,
    };
  }

  public async create(keyPair: KeyPair): Promise<KeyPair> {
    return super.create(keyPair);
  }

  public async update(keyPair: KeyPair): Promise<KeyPair> {
    return super.update(keyPair);
  }

  public async find(filter: IKeyPairFilter): Promise<KeyPair> {
    return super.find(filter);
  }

  public async findMany(filter: IKeyPairFilter): Promise<Array<KeyPair>> {
    return super.findMany(filter);
  }

  public async remove(keyPair: KeyPair): Promise<void> {
    await super.remove(keyPair);
  }
}
