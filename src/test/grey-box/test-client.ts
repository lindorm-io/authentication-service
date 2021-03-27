import { Client } from "@lindorm-io/koa-client";
import { encryptClientSecret } from "../../support";

export const getTestClient = (secret = true): Client =>
  new Client({
    id: "9ba5e0c5-f2aa-4706-a27d-66369b547b0b",
    approved: true,
    extra: { emailAuthorizationUri: "https://lindorm.io/" },
    secret: secret ? { signature: encryptClientSecret("test_client_secret"), updated: new Date() } : null,
  });
