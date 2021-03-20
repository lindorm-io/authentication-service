import { KeyPairRepository } from "../infrastructure";
import { KeyType } from "@lindorm-io/key-pair";
import { MONGO_CONNECTION_OPTIONS } from "../config";
import { MongoConnection } from "@lindorm-io/mongo";
import { generateKeyPair } from "../support";
import { winston } from "../logger";

(async () => {
  try {
    const mongo = new MongoConnection(MONGO_CONNECTION_OPTIONS);
    await mongo.connect();

    const repository = new KeyPairRepository({ logger: winston, db: mongo.getDatabase() });

    const keyPair = await generateKeyPair(KeyType.EC);
    keyPair.allowed = true;

    await repository.create(keyPair);
  } catch (err) {
    winston.error("error", err);
  } finally {
    process.exit(0);
  }
})();
