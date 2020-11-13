import { MongoConnectionType } from "@lindorm-io/mongo";

export const MOCK_MONGO_OPTIONS = {
  type: MongoConnectionType.MEMORY,
  auth: {
    user: "user",
    password: "password",
  },
  url: {
    host: "host",
    port: 1234,
  },
  databaseName: "databaseName",
};
