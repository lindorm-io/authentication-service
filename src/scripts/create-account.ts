import { AccountRepository } from "../infrastructure";
import { MONGO_CONNECTION_OPTIONS } from "../config";
import { MongoConnection } from "@lindorm-io/mongo";
import { winston } from "../logger";
import { Account } from "../entity";
import { getRandomValue } from "@lindorm-io/core";
import { ensureIdentity } from "../axios";

(async () => {
  const mongo = new MongoConnection(MONGO_CONNECTION_OPTIONS);

  try {
    await mongo.connect();

    const repository = new AccountRepository({ logger: winston, db: mongo.getDatabase() });

    const account = new Account({
      email: `${getRandomValue(12)}@test.lindorm.io`,
    });

    await repository.create(account);

    winston.info("account created", { email: account.email });

    const data = await ensureIdentity(account);

    winston.info("identity created", data);
  } catch (err) {
    winston.error("error", err);
  } finally {
    await mongo.disconnect();
    process.exit(0);
  }
})();
