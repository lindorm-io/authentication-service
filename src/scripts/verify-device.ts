import axios from "axios";
import { Account, Session } from "../entity";
import { AccountRepository, KeyPairRepository, SessionRepository } from "../infrastructure";
import { Audience, GrantType, ResponseType } from "../enum";
import { DEVICE_SERVICE_BASE_URL, JWT_ISSUER, MONGO_CONNECTION_OPTIONS } from "../config";
import { KeyPairHandler, Keystore } from "@lindorm-io/key-pair";
import { MongoConnection } from "@lindorm-io/mongo";
import { Permission, Scope, TokenIssuer } from "@lindorm-io/jwt";
import { getKeyPairEC, getKeyPairRSA } from "../test";
import { getRandomValue } from "@lindorm-io/core";
import { getSessionExpires } from "../support";
import { v4 as uuid } from "uuid";
import { verifyDevicePIN, verifyDeviceSecret } from "../axios";
import { winston } from "../logger";

const keyPairHandler = new KeyPairHandler({
  algorithm: "RS512",
  passphrase: "",
  privateKey: getKeyPairRSA().privateKey,
  publicKey: null,
});

const createKeystore = async (mongo: MongoConnection): Promise<Keystore> => {
  const keyPair = getKeyPairEC();
  const repository = new KeyPairRepository({ db: mongo.getDatabase(), logger: winston });
  await repository.create(keyPair);

  return new Keystore({ keys: [keyPair] });
};

const createIssuer = (keystore: Keystore): TokenIssuer => {
  return new TokenIssuer({
    issuer: JWT_ISSUER,
    keystore,
    logger: winston,
  });
};

const createAccessToken = (issuer: TokenIssuer, account: Account): string => {
  const data = issuer.sign({
    audience: Audience.ACCESS,
    authMethodsReference: "email",
    expiry: "2 minutes",
    permission: Permission.USER,
    scope: [Scope.DEFAULT, Scope.EDIT].join(" "),
    subject: account.id,
  });

  return data.token;
};

const createAccount = async (mongo: MongoConnection) => {
  const repository = new AccountRepository({ db: mongo.getDatabase(), logger: winston });
  return await repository.create(
    new Account({
      email: `${getRandomValue(12)}@test.lindorm.io`,
    }),
  );
};

const createSession = async (mongo: MongoConnection, account: Account, deviceId: string) => {
  const repository = new SessionRepository({ db: mongo.getDatabase(), logger: winston });
  return await repository.create(
    new Session({
      authorization: {
        codeChallenge: getRandomValue(32),
        codeMethod: "sha512",
        deviceChallenge: "long_device_challenge",
        email: account.email,
        id: uuid(),
        otpCode: null,
        redirectUri: "https://lindorm.io",
        responseType: [ResponseType.ACCESS].join(" "),
      },
      clientId: "bbeab78c-4a3b-469b-a16e-0c0d2130299d",
      deviceId,
      expires: getSessionExpires("2 minutes"),
      grantType: GrantType.EMAIL_LINK,
      scope: [Scope.DEFAULT, Scope.EDIT].join(" "),
    }),
  );
};

const createDevice = async (accessToken: string) => {
  const url = new URL(`/device`, DEVICE_SERVICE_BASE_URL);

  const response = await axios.post(
    url.toString(),
    {
      name: "My iPhone",
      pin: "123456",
      public_key: getKeyPairRSA().publicKey,
      secret: "long_device_secret",
    },
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    },
  );

  return response.data;
};

(async () => {
  try {
    const mongo = new MongoConnection(MONGO_CONNECTION_OPTIONS);
    await mongo.connect();

    const keystore = await createKeystore(mongo);
    const issuer = await createIssuer(keystore);
    const account = await createAccount(mongo);
    const accessToken = createAccessToken(issuer, account);

    const { device_id: deviceId } = await createDevice(accessToken);
    const session = await createSession(mongo, account, deviceId);

    await verifyDevicePIN({
      account,
      deviceVerifier: keyPairHandler.sign("long_device_challenge"),
      pin: "123456",
      session,
    });

    await verifyDeviceSecret({
      account,
      deviceVerifier: keyPairHandler.sign("long_device_challenge"),
      secret: "long_device_secret",
      session,
    });
  } catch (err) {
    winston.error("error", err);
  } finally {
    process.exit(0);
  }
})();
