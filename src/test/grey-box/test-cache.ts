import { AuthorizationCache, RequestLimitCache } from "../../infrastructure";
import { ClientCache } from "@lindorm-io/koa-client";
import { KeyPairCache } from "@lindorm-io/koa-keystore";
import { getTestRedis } from "./test-redis";
import { winston } from "../../logger";

export interface IGetGreyBoxCache {
  authorization: AuthorizationCache;
  client: ClientCache;
  keyPair: KeyPairCache;
  requestLimit: RequestLimitCache;
}

export const getTestCache = async (): Promise<IGetGreyBoxCache> => {
  const redis = await getTestRedis();

  const client = redis.getClient();
  const logger = winston;

  return {
    authorization: new AuthorizationCache({ client, logger }),
    client: new ClientCache({ client, logger }),
    keyPair: new KeyPairCache({ client, logger }),
    requestLimit: new RequestLimitCache({ client, logger }),
  };
};
