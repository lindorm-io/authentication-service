import MockDate from "mockdate";
import request from "supertest";
import { Account, Client } from "../../entity";
import { Audience, Permission, Scope } from "../../enum";
import { JWT_ACCESS_TOKEN_EXPIRY, JWT_ISSUER } from "../../config";
import { KeyPair, Keystore } from "@lindorm-io/key-pair";
import { MOCK_KEY_PAIR_OPTIONS } from "../mocks";
import { RepositoryEntityNotFoundError } from "@lindorm-io/mongo";
import { TokenIssuer } from "@lindorm-io/jwt";
import { encryptAccountPassword, encryptClientSecret } from "../../support";
import { getRandomValue } from "@lindorm-io/core";
import { koa } from "../../server/koa";
import { v4 as uuid } from "uuid";
import { winston } from "../../logger";
import {
  loadMongoConnection,
  TEST_ACCOUNT_REPOSITORY,
  TEST_CLIENT_ID,
  TEST_CLIENT_REPOSITORY,
  TEST_KEY_PAIR_REPOSITORY,
} from "../connection/mongo-connection";

MockDate.set("2020-01-01 08:00:00.000");

describe("/client", () => {
  let account: Account;
  let accessToken: string;

  beforeAll(async () => {
    await loadMongoConnection();

    koa.load();

    account = await TEST_ACCOUNT_REPOSITORY.create(
      new Account({
        email: "test@lindorm.io",
        password: { signature: await encryptAccountPassword("password"), updated: new Date() },
        permission: Permission.ADMIN,
      }),
    );

    const keyPair = await TEST_KEY_PAIR_REPOSITORY.create(new KeyPair(MOCK_KEY_PAIR_OPTIONS));

    const tokenIssuer = new TokenIssuer({
      issuer: JWT_ISSUER,
      logger: winston,
      keystore: new Keystore({ keys: [keyPair] }),
    });

    ({ token: accessToken } = tokenIssuer.sign({
      audience: Audience.ACCESS,
      clientId: TEST_CLIENT_ID,
      expiry: JWT_ACCESS_TOKEN_EXPIRY,
      permission: account.permission,
      scope: [Scope.DEFAULT, Scope.OPENID].join(" "),
      subject: account.id,
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
