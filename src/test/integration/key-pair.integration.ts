import MockDate from "mockdate";
import request from "supertest";
import { Account } from "../../entity";
import { Audience, Permission, Scope } from "../../enum";
import { JWT_ACCESS_TOKEN_EXPIRY, JWT_ISSUER } from "../../config";
import { KeyPair, Keystore, KeyType } from "@lindorm-io/key-pair";
import { MOCK_EC_PRIVATE_KEY, MOCK_EC_PUBLIC_KEY, MOCK_KEY_PAIR_OPTIONS } from "../mocks";
import { TokenIssuer } from "@lindorm-io/jwt";
import { encryptAccountPassword } from "../../support";
import { koa } from "../../server/koa";
import { v4 as uuid } from "uuid";
import { winston } from "../../logger";
import {
  TEST_ACCOUNT_REPOSITORY,
  TEST_CLIENT_ID,
  TEST_KEY_PAIR_REPOSITORY,
  loadMongoConnection,
} from "../connection/mongo-connection";

MockDate.set("2020-01-01 08:00:00.000");

describe("/key-pair", () => {
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
      .post("/key-pair/")
      .set("Authorization", `Bearer ${accessToken}`)
      .set("X-Correlation-ID", uuid())
      .send({
        type: KeyType.EC,
      })
      .expect(201);

    expect(response.body).toStrictEqual({
      algorithm: "ES512",
      key_pair_id: expect.any(String),
      type: "ec",
    });

    await expect(TEST_KEY_PAIR_REPOSITORY.find({ id: response.body.key_pair_id })).resolves.toStrictEqual(
      expect.objectContaining({
        id: response.body.key_pair_id,
      }),
    );
  });

  test("PATCH /:id/expire", async () => {
    const tmp = await TEST_KEY_PAIR_REPOSITORY.create(
      new KeyPair({
        algorithm: "ES512",
        privateKey: MOCK_EC_PRIVATE_KEY,
        publicKey: MOCK_EC_PUBLIC_KEY,
        type: "ec",
      }),
    );

    await request(koa.callback())
      .patch(`/key-pair/${tmp.id}/expire`)
      .set("Authorization", `Bearer ${accessToken}`)
      .set("X-Correlation-ID", uuid())
      .send({
        expires: "10 days",
      })
      .expect(204);

    await expect(TEST_KEY_PAIR_REPOSITORY.find({ id: tmp.id })).resolves.toStrictEqual(
      expect.objectContaining({
        expires: new Date("2020-01-11T07:00:00.000Z"),
      }),
    );
  });
});
