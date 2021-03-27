import { CacheBase, ICache, ICacheOptions } from "@lindorm-io/redis";
import { IAuthorization, Authorization } from "../../entity";
import { schema } from "./schema";

export interface IAuthorizationCache extends ICache<Authorization> {
  create(entity: Authorization): Promise<Authorization>;
  find(id: string): Promise<Authorization>;
  findAll(): Promise<Array<Authorization>>;
  remove(entity: Authorization): Promise<void>;
}

export class AuthorizationCache extends CacheBase<Authorization> implements IAuthorizationCache {
  constructor(options: ICacheOptions) {
    super({
      client: options.client,
      entityName: "Authorization",
      expiresInSeconds: options.expiresInSeconds,
      logger: options.logger,
      schema,
    });
  }

  protected createEntity(data: IAuthorization): Authorization {
    return new Authorization(data);
  }

  protected getEntityJSON(entity: Authorization): IAuthorization {
    return {
      id: entity.id,
      version: entity.version,
      created: entity.created,
      updated: entity.updated,
      events: entity.events,

      challengeId: entity.challengeId,
      clientId: entity.clientId,
      codeChallenge: entity.codeChallenge,
      codeMethod: entity.codeMethod,
      deviceId: entity.deviceId,
      email: entity.email,
      expires: entity.expires,
      grantType: entity.grantType,
      otpCode: entity.otpCode,
      redirectUri: entity.redirectUri,
      responseType: entity.responseType,
      scope: entity.scope,
    };
  }

  protected getEntityKey(entity: Authorization): string {
    return entity.id;
  }

  public async create(entity: Authorization): Promise<Authorization> {
    return super.create(entity);
  }

  public async find(id: string): Promise<Authorization> {
    return super.find(id);
  }

  public async findAll(): Promise<Array<Authorization>> {
    return super.findAll();
  }

  public async remove(entity: Authorization): Promise<void> {
    await super.remove(entity);
  }
}
