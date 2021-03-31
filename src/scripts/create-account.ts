import { AccountRepository } from "../infrastructure";
import { config, MONGO_CONNECTION_OPTIONS } from "../config";
import { MongoConnection } from "@lindorm-io/mongo";
import { winston } from "../logger";
import { Account } from "../entity";
import { getRandomValue } from "@lindorm-io/core";
import { requestEnsureIdentity } from "../axios";
import { Axios } from "@lindorm-io/axios";

(async () => {
  const mongo = new MongoConnection(MONGO_CONNECTION_OPTIONS);
  const ctx = {
    axios: {
      identity: new Axios({
        auth: {
          basic: {
            username: config.IDENTITY_SERVICE_AUTH_USERNAME,
            password: config.IDENTITY_SERVICE_AUTH_PASSWORD,
          },
        },
        baseUrl: config.IDENTITY_SERVICE_BASE_URL,
        logger: winston,
        name: "identity",
      }),
    },
  };

  try {
    await mongo.connect();

    const repository = new AccountRepository({ logger: winston, db: mongo.getDatabase() });

    const account = await repository.create(
      new Account({
        email: `${getRandomValue(12)}@test.lindorm.io`,
      }),
    );

    try {
      await requestEnsureIdentity(ctx as any)(account);
    } catch (err) {
      winston.error("axios error", err);
    }

    winston.info("account created", { id: account.id, email: account.email });
  } catch (err) {
    winston.error("error", err);
  } finally {
    await mongo.disconnect();
    process.exit(0);
  }
})();
