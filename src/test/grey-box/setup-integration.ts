import { AccountRepository, RequestLimitCache, SessionRepository } from "../../infrastructure";
import { Client, ClientCache, ClientRepository } from "@lindorm-io/koa-client";
import { JWT_ISSUER } from "../../config";
import { KeyPairCache, KeyPairRepository } from "@lindorm-io/koa-keystore";
import { KeyPairHandler, Keystore } from "@lindorm-io/key-pair";
import { TokenIssuer } from "@lindorm-io/jwt";
import { getTestCache } from "./test-cache";
import { getTestClient } from "./test-client";
import { getTestKeyPairEC, getTestKeyPairRSA } from "./test-key-pair";
import { getTestRepository } from "./test-repository";
import { winston } from "../../logger";
import { inMemoryKeys } from "./in-memory";

export let TEST_ACCOUNT_REPOSITORY: AccountRepository;
export let TEST_CLIENT_REPOSITORY: ClientRepository;
export let TEST_KEY_PAIR_REPOSITORY: KeyPairRepository;
export let TEST_SESSION_REPOSITORY: SessionRepository;

export let TEST_CLIENT_CACHE: ClientCache;
export let TEST_KEY_PAIR_CACHE: KeyPairCache;
export let TEST_REQUEST_LIMIT_CACHE: RequestLimitCache;

export let TEST_TOKEN_ISSUER: TokenIssuer;
export let TEST_KEY_PAIR_HANDLER: KeyPairHandler;

export let TEST_CLIENT: Client;

export const setupIntegration = async (): Promise<void> => {
  const { account, client, keyPair, session } = await getTestRepository();
  const {
    client: clientCache,
    keyPair: { auth: keyPairCache },
    requestLimit,
  } = await getTestCache();

  const keyPairEC = getTestKeyPairEC();
  const keyPairRSA = getTestKeyPairRSA();

  TEST_ACCOUNT_REPOSITORY = account;
  TEST_CLIENT_REPOSITORY = client;
  TEST_KEY_PAIR_REPOSITORY = keyPair;
  TEST_SESSION_REPOSITORY = session;

  TEST_CLIENT_CACHE = clientCache;
  TEST_KEY_PAIR_CACHE = keyPairCache;
  TEST_REQUEST_LIMIT_CACHE = requestLimit;

  inMemoryKeys.push(keyPairEC);

  TEST_TOKEN_ISSUER = new TokenIssuer({
    issuer: JWT_ISSUER,
    logger: winston,
    keystore: new Keystore({ keys: inMemoryKeys }),
  });
  TEST_KEY_PAIR_HANDLER = new KeyPairHandler(keyPairRSA);

  TEST_CLIENT = getTestClient();

  await TEST_CLIENT_REPOSITORY.create(TEST_CLIENT);
  await TEST_CLIENT_CACHE.create(TEST_CLIENT);

  await TEST_KEY_PAIR_REPOSITORY.create(keyPairEC);
  await TEST_KEY_PAIR_CACHE.create(keyPairEC);
};
