import { MONGO_CONNECTION_OPTIONS } from "../../config";
import { MongoConnection, MongoConnectionType } from "@lindorm-io/mongo";
import { TokenIssuer } from "@lindorm-io/jwt";
import { generateTestAccount, IGenerateTestAccountData } from "./generate-test-account";
import { generateTestClient, IGenerateTestClientData } from "./generate-test-client";
import { generateTestDevice, IGenerateTestDeviceData } from "./generate-test-device";
import { generateTestKeyPair } from "./generate-test-key-pair";
import { generateTestTokenIssuer } from "./generate-test-token-issuer";
import { inMemoryStore } from "../../middleware";
import { winston } from "../../logger";
import {
  AccountRepository,
  ClientRepository,
  DeviceRepository,
  KeyPairRepository,
  SessionRepository,
} from "../../infrastructure";

const logger = winston.createChildLogger(["grey-box", "mongo"]);

export let TEST_ACCOUNT: IGenerateTestAccountData;
export let TEST_ACCOUNT_PWD: IGenerateTestAccountData;
export let TEST_ACCOUNT_OTP: IGenerateTestAccountData;
export let TEST_CLIENT: IGenerateTestClientData;
export let TEST_DEVICE: IGenerateTestDeviceData;

export let TEST_TOKEN_ISSUER: TokenIssuer;

export let TEST_ACCOUNT_REPOSITORY: AccountRepository;
export let TEST_CLIENT_REPOSITORY: ClientRepository;
export let TEST_DEVICE_REPOSITORY: DeviceRepository;
export let TEST_KEY_PAIR_REPOSITORY: KeyPairRepository;
export let TEST_SESSION_REPOSITORY: SessionRepository;

export const loadMongoConnection = async (): Promise<void> => {
  const mongo = new MongoConnection({
    ...MONGO_CONNECTION_OPTIONS,
    type: MongoConnectionType.MEMORY,
    inMemoryStore,
  });

  await mongo.connect();
  const db = mongo.getDatabase();

  TEST_ACCOUNT_REPOSITORY = new AccountRepository({ db, logger });
  TEST_CLIENT_REPOSITORY = new ClientRepository({ db, logger });
  TEST_DEVICE_REPOSITORY = new DeviceRepository({ db, logger });
  TEST_KEY_PAIR_REPOSITORY = new KeyPairRepository({ db, logger });
  TEST_SESSION_REPOSITORY = new SessionRepository({ db, logger });

  TEST_ACCOUNT = await generateTestAccount({
    hasPassword: false,
    hasOtp: false,
  });
  TEST_ACCOUNT_PWD = await generateTestAccount({
    hasPassword: true,
    hasOtp: false,
  });
  TEST_ACCOUNT_OTP = await generateTestAccount({
    hasPassword: true,
    hasOtp: true,
  });
  TEST_CLIENT = await generateTestClient();
  TEST_DEVICE = await generateTestDevice(TEST_ACCOUNT_OTP.account);

  const keyPair = await generateTestKeyPair();
  TEST_TOKEN_ISSUER = generateTestTokenIssuer(keyPair);

  await TEST_ACCOUNT_REPOSITORY.create(TEST_ACCOUNT.account);
  await TEST_ACCOUNT_REPOSITORY.create(TEST_ACCOUNT_PWD.account);
  await TEST_ACCOUNT_REPOSITORY.create(TEST_ACCOUNT_OTP.account);
  await TEST_CLIENT_REPOSITORY.create(TEST_CLIENT.client);
  await TEST_DEVICE_REPOSITORY.create(TEST_DEVICE.device);
  await TEST_KEY_PAIR_REPOSITORY.create(keyPair);
};
