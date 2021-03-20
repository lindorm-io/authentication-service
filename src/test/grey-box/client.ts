import { Client } from "@lindorm-io/koa-client";
import { encryptClientSecret } from "../../support";

export const getGreyBoxClient = (): Client =>
  new Client({
    id: "9ba5e0c5-f2aa-4706-a27d-66369b547b0b",
    approved: true,
    extra: { emailAuthorizationUri: "http://lindorm.io/" },
    secret: encryptClientSecret("test_client_secret"),
  });

export const getGreyBoxClientWithSecret = (): Client =>
  new Client({
    id: "bc179367-e705-4d74-ad6b-964cacf07c71",
    approved: true,
    extra: { emailAuthorizationUri: "http://lindorm.io/" },
  });
