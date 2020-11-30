import { ClientCache } from "@lindorm-io/koa-client";
import { KeyPairCache, RequestLimitCache } from "../../infrastructure";
import { REDIS_CONNECTION_OPTIONS } from "../../config";
import { RedisConnection, RedisConnectionType } from "@lindorm-io/redis";
import { inMemoryCache } from "./in-memory";
import { winston } from "../../logger";

export interface IGetGreyBoxCache {
  client: ClientCache;
  keyPair: KeyPairCache;
  requestLimit: RequestLimitCache;
}

export const getGreyBoxCache = async (): Promise<IGetGreyBoxCache> => {
  const redis = new RedisConnection({
    ...REDIS_CONNECTION_OPTIONS,
    type: RedisConnectionType.MEMORY,
    inMemoryCache,
  });

  await redis.connect();

  const logger = winston;
  const client = redis.getClient();

  return {
    client: new ClientCache({ client, logger }),
    keyPair: new KeyPairCache({ client, logger }),
    requestLimit: new RequestLimitCache({ client, logger }),
  };
};
