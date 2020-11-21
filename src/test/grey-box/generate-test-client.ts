import { Client } from "@lindorm-io/koa-client";
import { encryptClientSecret } from "../../support";
import { getRandomValue } from "@lindorm-io/core";

export interface IGenerateTestClientData {
  client: Client;
  id: string;
  secret: string;
}

export const generateTestClient = async (): Promise<IGenerateTestClientData> => {
  const secret = getRandomValue(32);

  const client = new Client({
    approved: true,
    extra: { emailAuthorizationUri: "http://lindorm.io/" },
    secret: encryptClientSecret(secret),
  });

  return {
    client,
    id: client.id,
    secret,
  };
};
