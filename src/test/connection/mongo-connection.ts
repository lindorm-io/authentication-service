import { Algorithm, KeyPair, KeyType } from "@lindorm-io/key-pair";
import { Client } from "../../entity";
import { MONGO_MW_OPTIONS } from "../../config";
import { MongoConnection, MongoConnectionType } from "@lindorm-io/mongo";
import { encryptClientSecret } from "../../support/client";
import { inMemoryStore } from "../../middleware";
import { winston } from "../../logger";
import {
  AccountRepository,
  ClientRepository,
  DeviceRepository,
  KeyPairRepository,
  SessionRepository,
} from "../../repository";

export const TEST_CLIENT_ID = "e89184e9-fdb7-4561-a8cf-0097d69749c0";
export const TEST_CLIENT_SECRET = "long-client-secret";

export let TEST_ACCOUNT_REPOSITORY: AccountRepository;
export let TEST_CLIENT_REPOSITORY: ClientRepository;
export let TEST_DEVICE_REPOSITORY: DeviceRepository;
export let TEST_KEY_PAIR_REPOSITORY: KeyPairRepository;
export let TEST_SESSION_REPOSITORY: SessionRepository;

export const loadMongoConnection = async (): Promise<void> => {
  const mongo = new MongoConnection({
    ...MONGO_MW_OPTIONS,
    type: MongoConnectionType.MEMORY,
    inMemoryStore,
  });

  await mongo.connect();
  const db = mongo.getDatabase();

  const logger = winston;

  TEST_ACCOUNT_REPOSITORY = new AccountRepository({ db, logger });
  TEST_CLIENT_REPOSITORY = new ClientRepository({ db, logger });
  TEST_DEVICE_REPOSITORY = new DeviceRepository({ db, logger });
  TEST_KEY_PAIR_REPOSITORY = new KeyPairRepository({ db, logger });
  TEST_SESSION_REPOSITORY = new SessionRepository({ db, logger });

  await TEST_CLIENT_REPOSITORY.create(
    new Client({
      id: TEST_CLIENT_ID,
      secret: await encryptClientSecret(TEST_CLIENT_SECRET),
      approved: true,
      emailAuthorizationUri: "https://lindorm.io/",
    }),
  );

  await TEST_KEY_PAIR_REPOSITORY.create(
    new KeyPair({
      algorithm: Algorithm.ES512,
      privateKey:
        "-----BEGIN PRIVATE KEY-----\n" +
        "MIHuAgEAMBAGByqGSM49AgEGBSuBBAAjBIHWMIHTAgEBBEIBGma7xGZpaAngFXf3\n" +
        "mJF3IxZfDpI+6wU564K+eehxX104v6dZetjSfMx0rvsYX/s6cO2P3GE7R95VxWEk\n" +
        "+f4EX0qhgYkDgYYABAB8cBfDwCi41G4kVW4V3Y86nIMMCypYzfO8gYjpS091lxkM\n" +
        "goTRS3LM1p65KQfwBolrWIdVrbbOILASf06fQsHw5gEt4snVuMBO+LS6pesX9vA8\n" +
        "QT1LjX75Xq2InnLY1VToeNmxkuM+oDZgqHOYwzfUhu+zZaA5AuEkqPi47TA9iCSY\n" +
        "VQ==\n" +
        "-----END PRIVATE KEY-----\n",
      publicKey:
        "-----BEGIN PUBLIC KEY-----\n" +
        "MIGbMBAGByqGSM49AgEGBSuBBAAjA4GGAAQAfHAXw8AouNRuJFVuFd2POpyDDAsq\n" +
        "WM3zvIGI6UtPdZcZDIKE0UtyzNaeuSkH8AaJa1iHVa22ziCwEn9On0LB8OYBLeLJ\n" +
        "1bjATvi0uqXrF/bwPEE9S41++V6tiJ5y2NVU6HjZsZLjPqA2YKhzmMM31Ibvs2Wg\n" +
        "OQLhJKj4uO0wPYgkmFU=\n" +
        "-----END PUBLIC KEY-----\n",
      type: KeyType.EC,
    }),
  );
};
