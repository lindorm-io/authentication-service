import MockDate from "mockdate";
import request from "supertest";
import { Audience, Scope } from "../../enum";
import { Client } from "../../entity";
import { JWT_ACCESS_TOKEN_EXPIRY } from "../../config";
import { RepositoryEntityNotFoundError } from "@lindorm-io/mongo";
import { encryptClientSecret } from "../../support/client";
import { getRandomValue } from "@lindorm-io/core";
import { koa } from "../../server/koa";
import { v4 as uuid } from "uuid";
import {
  TEST_ACCOUNT,
  TEST_CLIENT,
  TEST_CLIENT_REPOSITORY,
  TEST_TOKEN_ISSUER,
  loadMongoConnection,
  loadRedisConnection,
} from "../grey-box";

MockDate.set("2020-01-01 08:00:00.000");

describe("/client", () => {
  let accessToken: string;

  beforeAll(async () => {
    await loadMongoConnection();
    await loadRedisConnection();
    koa.load();

    ({ token: accessToken } = TEST_TOKEN_ISSUER.sign({
      audience: Audience.ACCESS,
      clientId: TEST_CLIENT.id,
      expiry: JWT_ACCESS_TOKEN_EXPIRY,
      permission: TEST_ACCOUNT.permission,
      scope: [Scope.DEFAULT, Scope.OPENID].join(" "),
      subject: TEST_ACCOUNT.id,
    }));
  });

  test("POST /", async () => {
    const response = await request(koa.callback())
      .post("/client/")
      .set("Authorization", `Bearer ${accessToken}`)
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
    const tmp = await TEST_CLIENT_REPOSITORY.create(
      new Client({
        secret: await encryptClientSecret("secret"),
        approved: true,
        emailAuthorizationUri: "https://lindorm.io/",
      }),
    );

    await request(koa.callback())
      .patch(`/client/${tmp.id}`)
      .set("Authorization", `Bearer ${accessToken}`)
      .set("X-Correlation-ID", uuid())
      .send({
        approved: false,
        description: "new-description",
        email_authorization_uri: "https://lindorm.io/new",
        name: "new-name",
        secret: getRandomValue(32),
      })
      .expect(204);

    await expect(TEST_CLIENT_REPOSITORY.find({ id: tmp.id })).resolves.toStrictEqual(
      expect.objectContaining({
        approved: false,
        description: "new-description",
        emailAuthorizationUri: "https://lindorm.io/new",
        name: "new-name",
      }),
    );
  });

  test("DELETE /:id", async () => {
    const tmp = await TEST_CLIENT_REPOSITORY.create(
      new Client({
        secret: await encryptClientSecret("secret"),
        approved: true,
        emailAuthorizationUri: "https://lindorm.io/",
      }),
    );

    await request(koa.callback())
      .delete(`/client/${tmp.id}`)
      .set("Authorization", `Bearer ${accessToken}`)
      .set("X-Correlation-ID", uuid())
      .expect(202);

    await expect(TEST_CLIENT_REPOSITORY.find({ id: tmp.id })).rejects.toStrictEqual(
      expect.any(RepositoryEntityNotFoundError),
    );
  });
});
