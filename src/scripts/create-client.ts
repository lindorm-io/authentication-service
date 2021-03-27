import { Client, ClientCache, ClientRepository } from "@lindorm-io/koa-client";
import { MONGO_CONNECTION_OPTIONS, REDIS_CONNECTION_OPTIONS } from "../config";
import { MongoConnection } from "@lindorm-io/mongo";
import { RedisConnection } from "@lindorm-io/redis";
import { winston } from "../logger";

(async () => {
  const mongo = new MongoConnection(MONGO_CONNECTION_OPTIONS);
  const redis = new RedisConnection(REDIS_CONNECTION_OPTIONS);

  try {
    await mongo.connect();
    const repository = new ClientRepository({ logger: winston, db: mongo.getDatabase() });

    await redis.connect();
    const cache = new ClientCache({ logger: winston, client: redis.getClient() });

    const client = await repository.create(
      new Client({
        approved: true,
      }),
    );
    await cache.create(client);

    winston.info("client created", { id: client.id });
  } catch (err) {
    winston.error("error", err);
  } finally {
    await mongo.disconnect();
    process.exit(0);
  }
})();
