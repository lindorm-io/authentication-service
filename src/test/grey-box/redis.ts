import { ClientCache } from "@lindorm-io/koa-client";
import { KeyPairCache, RequestLimitCache } from "../../infrastructure";
import { REDIS_CONNECTION_OPTIONS } from "../../config";
import { RedisConnection, RedisConnectionType } from "@lindorm-io/redis";
import { generateTestClient, IGenerateTestClientData } from "./generate-test-client";
import { inMemoryCache } from "../../middleware";
import { winston } from "../../logger";

const logger = winston.createChildLogger(["grey-box", "redis"]);

export let TEST_CLIENT: IGenerateTestClientData;

export let TEST_CLIENT_CACHE: ClientCache;
export let TEST_KEY_PAIR_CACHE: KeyPairCache;
export let TEST_REQUEST_LIMIT_CACHE: RequestLimitCache;

export const loadRedisConnection = async (): Promise<void> => {
  const redis = new RedisConnection({
    ...REDIS_CONNECTION_OPTIONS,
    type: RedisConnectionType.MEMORY,
    inMemoryCache,
  });
  await redis.connect();
  const client = redis.getClient();

  TEST_CLIENT_CACHE = new ClientCache({ client, logger });
  TEST_KEY_PAIR_CACHE = new KeyPairCache({ client, logger });
  TEST_REQUEST_LIMIT_CACHE = new RequestLimitCache({ client, logger });

  TEST_CLIENT = await generateTestClient();
  await TEST_CLIENT_CACHE.create(TEST_CLIENT.client);
};
