import { KeyPairRepository } from "@lindorm-io/koa-keystore";
import { KeyType } from "@lindorm-io/key-pair";
import { MONGO_CONNECTION_OPTIONS } from "../config";
import { MongoConnection } from "@lindorm-io/mongo";
import { generateKeyPair } from "../support";
import { winston } from "../logger";

(async () => {
  const mongo = new MongoConnection(MONGO_CONNECTION_OPTIONS);
  try {
    await mongo.connect();

    const repository = new KeyPairRepository({ logger: winston, db: mongo.getDatabase() });

    const keyPair = await generateKeyPair(KeyType.EC);
    keyPair.allowed = true;

    await repository.create(keyPair);
  } catch (err) {
    winston.error("error", err);
  } finally {
    await mongo.disconnect();
    process.exit(0);
  }
})();
