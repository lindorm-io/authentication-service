import { KeyPairCache, KeyPairRepository } from "@lindorm-io/koa-keystore";
import { KeyType } from "@lindorm-io/key-pair";
import { MONGO_CONNECTION_OPTIONS, REDIS_CONNECTION_OPTIONS } from "../config";
import { MongoConnection } from "@lindorm-io/mongo";
import { generateKeyPair } from "../support";
import { winston } from "../logger";
import { RedisConnection } from "@lindorm-io/redis";

(async () => {
  const mongo = new MongoConnection(MONGO_CONNECTION_OPTIONS);
  const redis = new RedisConnection(REDIS_CONNECTION_OPTIONS);

  try {
    await mongo.connect();
    await redis.connect();

    const repository = new KeyPairRepository({ logger: winston, db: mongo.getDatabase() });
    const cache = new KeyPairCache({ logger: winston, client: redis.getClient() });

    const keyPair = await generateKeyPair(KeyType.EC);
    keyPair.allowed = true;

    const created = await repository.create(keyPair);
    await cache.create(created);

    winston.info("key pair created", { id: created.id });
  } catch (err) {
    winston.error("error", err);
  } finally {
    await mongo.disconnect();
    process.exit(0);
  }
})();
