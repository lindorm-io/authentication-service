import { schema } from "./schema";
import { CacheBase, ICache, ICacheOptions } from "@lindorm-io/redis";
import { IKeyPair, KeyPair } from "@lindorm-io/key-pair";

export interface IKeyPairCache extends ICache<KeyPair> {
  create(entity: KeyPair): Promise<KeyPair>;
  update(entity: KeyPair): Promise<KeyPair>;
  find(id: string): Promise<KeyPair>;
  findAll(): Promise<Array<KeyPair>>;
  remove(entity: KeyPair): Promise<void>;
}

export class KeyPairCache extends CacheBase<KeyPair> implements IKeyPairCache {
  constructor(options: ICacheOptions) {
    super({
      client: options.client,
      entityName: "KeyPair",
      expiresInSeconds: options.expiresInSeconds,
      logger: options.logger,
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

      algorithm: entity.algorithm,
      expires: entity.expires,
      passphrase: entity.passphrase,
      privateKey: entity.privateKey,
      publicKey: entity.publicKey,
      type: entity.type,
    };
  }

  protected getEntityKey(entity: KeyPair): string {
    return entity.id;
  }

  public async create(entity: KeyPair): Promise<KeyPair> {
    return super.create(entity);
  }

  public async update(entity: KeyPair): Promise<KeyPair> {
    return super.update(entity);
  }

  public async find(id: string): Promise<KeyPair> {
    return super.find(id);
  }

  public async findAll(): Promise<Array<KeyPair>> {
    return super.findAll();
  }

  public async remove(entity: KeyPair): Promise<void> {
    await super.remove(entity);
  }
}
