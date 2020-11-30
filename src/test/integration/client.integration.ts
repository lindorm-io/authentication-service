import MockDate from "mockdate";
import request from "supertest";
import { Account } from "../../entity";
import { Client } from "@lindorm-io/koa-client";
import { RepositoryEntityNotFoundError } from "@lindorm-io/mongo";
import { encryptClientSecret } from "../../support/client";
import { getRandomValue } from "@lindorm-io/core";
import { koa } from "../../server/koa";
import { v4 as uuid } from "uuid";
import {
  TEST_ACCOUNT_REPOSITORY,
  TEST_CLIENT,
  TEST_CLIENT_REPOSITORY,
  getGreyBoxAccessToken,
  getGreyBoxAccountAdmin,
  setupIntegration,
} from "../grey-box";

MockDate.set("2020-01-01 08:00:00.000");

describe("/client", () => {
  let account: Account;
  let accessToken: string;

  beforeAll(async () => {
    await setupIntegration();
    koa.load();
  });

  beforeEach(async () => {
    account = await TEST_ACCOUNT_REPOSITORY.create(getGreyBoxAccountAdmin("admin@lindorm.io"));
    accessToken = getGreyBoxAccessToken(account);
  });

  test("POST /", async () => {
    const response = await request(koa.callback())
      .post("/client/")
      .set("Authorization", `Bearer ${accessToken}`)
      .set("X-Client-ID", TEST_CLIENT.id)
      .set("X-Correlation-ID", uuid())
      .send({
        description: "description",
        emailAuthorizationUri: "https://lindorm.io/",
        name: "name",
        secret: getRandomValue(32),
      })
      .expect(201);

    expect(response.body).toStrictEqual({
      client_id: expect.any(String),
    });

    await expect(TEST_CLIENT_REPOSITORY.find({ id: response.body.client_id })).resolves.toStrictEqual(
      expect.objectContaining({
        id: response.body.client_id,
      }),
    );
  });

  test("PATCH /:id", async () => {
    const client = await TEST_CLIENT_REPOSITORY.create(
      new Client({
        secret: await encryptClientSecret("secret"),
        approved: true,
        extra: { emailAuthorizationUri: "https://lindorm.io/" },
      }),
    );

    await request(koa.callback())
      .patch(`/client/${client.id}`)
      .set("Authorization", `Bearer ${accessToken}`)
      .set("X-Client-ID", TEST_CLIENT.id)
      .set("X-Correlation-ID", uuid())
      .send({
        approved: false,
        description: "new-description",
        email_authorization_uri: "https://lindorm.io/new",
        name: "new-name",
        secret: getRandomValue(32),
      })
      .expect(204);

    await expect(TEST_CLIENT_REPOSITORY.find({ id: client.id })).resolves.toStrictEqual(
      expect.objectContaining({
        approved: false,
        description: "new-description",
        extra: { emailAuthorizationUri: "https://lindorm.io/new" },
        name: "new-name",
      }),
    );
  });

  test("DELETE /:id", async () => {
    const client = await TEST_CLIENT_REPOSITORY.create(
      new Client({
        secret: await encryptClientSecret("secret"),
        approved: true,
        extra: { emailAuthorizationUri: "https://lindorm.io/" },
      }),
    );

    await request(koa.callback())
      .delete(`/client/${client.id}`)
      .set("Authorization", `Bearer ${accessToken}`)
      .set("X-Client-ID", TEST_CLIENT.id)
      .set("X-Correlation-ID", uuid())
      .expect(202);

    await expect(TEST_CLIENT_REPOSITORY.find({ id: client.id })).rejects.toStrictEqual(
      expect.any(RepositoryEntityNotFoundError),
    );
  });
});
