import { Client, ClientCache, ClientRepository } from "@lindorm-io/koa-client";
import { JWT_ISSUER } from "../../config";
import { KeyPairHandler, Keystore } from "@lindorm-io/key-pair";
import { TokenIssuer } from "@lindorm-io/jwt";
import { getGreyBoxCache } from "./redis";
import { getGreyBoxClientWithSecret } from "./client";
import { getGreyBoxRepository } from "./mongo";
import { getKeyPairEC, getKeyPairRSA } from "./key-pair";
import { winston } from "../../logger";
import {
  AccountRepository,
  DeviceRepository,
  KeyPairCache,
  KeyPairRepository,
  RequestLimitCache,
  SessionRepository,
} from "../../infrastructure";

export let TEST_ACCOUNT_REPOSITORY: AccountRepository;
export let TEST_CLIENT_REPOSITORY: ClientRepository;
export let TEST_DEVICE_REPOSITORY: DeviceRepository;
export let TEST_KEY_PAIR_REPOSITORY: KeyPairRepository;
export let TEST_SESSION_REPOSITORY: SessionRepository;

export let TEST_CLIENT_CACHE: ClientCache;
export let TEST_KEY_PAIR_CACHE: KeyPairCache;
export let TEST_REQUEST_LIMIT_CACHE: RequestLimitCache;

export let TEST_CLIENT: Client;

export let TEST_TOKEN_ISSUER: TokenIssuer;
export let TEST_KEY_PAIR_HANDLER: KeyPairHandler;

export const setupIntegration = async (): Promise<void> => {
  const { account, client, device, keyPair, session } = await getGreyBoxRepository();
  const { client: clientCache, keyPair: keyPairCache, requestLimit } = await getGreyBoxCache();

  const keyPairEC = getKeyPairEC();
  const keyPairRSA = getKeyPairRSA();

  TEST_ACCOUNT_REPOSITORY = account;
  TEST_CLIENT_REPOSITORY = client;
  TEST_DEVICE_REPOSITORY = device;
  TEST_KEY_PAIR_REPOSITORY = keyPair;
  TEST_SESSION_REPOSITORY = session;

  TEST_CLIENT_CACHE = clientCache;
  TEST_KEY_PAIR_CACHE = keyPairCache;
  TEST_REQUEST_LIMIT_CACHE = requestLimit;

  TEST_TOKEN_ISSUER = new TokenIssuer({
    issuer: JWT_ISSUER,
    logger: winston,
    keystore: new Keystore({ keys: [keyPairEC] }),
  });
  TEST_KEY_PAIR_HANDLER = new KeyPairHandler(keyPairRSA);

  TEST_CLIENT = getGreyBoxClientWithSecret();

  await TEST_CLIENT_REPOSITORY.create(TEST_CLIENT);
  await TEST_CLIENT_CACHE.create(TEST_CLIENT);

  await TEST_KEY_PAIR_REPOSITORY.create(keyPairEC);
  await TEST_KEY_PAIR_CACHE.create(keyPairEC);
};
