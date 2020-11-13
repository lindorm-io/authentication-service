import MockDate from "mockdate";
import request from "supertest";
import { Account, Client, Device } from "../../entity";
import { Audience, Permission, Scope } from "../../enum";
import { JWT_ACCESS_TOKEN_EXPIRY, JWT_ISSUER } from "../../config";
import { MOCK_KEY_PAIR_OPTIONS } from "../mocks";
import { RepositoryEntityNotFoundError } from "@lindorm-io/mongo";
import { TokenIssuer } from "@lindorm-io/jwt";
import { encryptAccountPassword, encryptClientSecret, encryptDevicePIN } from "../../support";
import { generateRSAKeys, KeyPair, Keystore } from "@lindorm-io/key-pair";
import { getRandomValue } from "@lindorm-io/core";
import { koa } from "../../server/koa";
import { v4 as uuid } from "uuid";
import { winston } from "../../logger";
import {
  loadMongoConnection,
  TEST_ACCOUNT_REPOSITORY,
  TEST_CLIENT_REPOSITORY,
  TEST_DEVICE_REPOSITORY,
  TEST_KEY_PAIR_REPOSITORY,
} from "../connection/mongo-connection";

MockDate.set("2020-01-01 08:00:00.000");

describe("/device", () => {
  let account: Account;
  let device: Device;
  let accessToken: string;
  let publicKey: string;

  beforeAll(async () => {
    await loadMongoConnection();

    koa.load();

    const client = await TEST_CLIENT_REPOSITORY.create(
      new Client({
        secret: await encryptClientSecret("secret"),
        approved: true,
        emailAuthorizationUri: "https://lindorm.io/",
      }),
    );

    account = await TEST_ACCOUNT_REPOSITORY.create(
      new Account({
        email: "test@lindorm.io",
        password: { signature: await encryptAccountPassword("password"), updated: new Date() },
        permission: Permission.ADMIN,
      }),
    );

    ({ publicKey } = await generateRSAKeys(""));

    device = await TEST_DEVICE_REPOSITORY.create(
      new Device({
        accountId: account.id,
        pin: {
          signature: await encryptDevicePIN("123456"),
          updated: new Date(),
        },
        publicKey,
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
      clientId: client.id,
      expiry: JWT_ACCESS_TOKEN_EXPIRY,
      permission: account.permission,
      scope: [Scope.DEFAULT, Scope.OPENID].join(" "),
      subject: account.id,
    }));
  });

  test("POST /", async () => {
    const response = await request(koa.callback())
      .post("/device/")
      .set("Authorization", `Bearer ${accessToken}`)
      .set("X-Correlation-ID", uuid())
      .send({
        name: "name",
        pin: "123456",
        public_key: publicKey,
        secret: getRandomValue(32),
      })
      .expect(201);

    expect(response.body).toStrictEqual({
      device_id: expect.any(String),
    });

    await expect(TEST_DEVICE_REPOSITORY.find({ id: response.body.device_id })).resolves.toStrictEqual(
      expect.objectContaining({
        id: response.body.device_id,
      }),
    );
  });

  test("DELETE /:id", async () => {
    const tmp = await TEST_DEVICE_REPOSITORY.create(
      new Device({
        accountId: account.id,
        pin: {
          signature: await encryptDevicePIN("123456"),
          updated: new Date(),
        },
        publicKey,
      }),
    );

    await request(koa.callback())
      .delete(`/device/${tmp.id}`)
      .set("Authorization", `Bearer ${accessToken}`)
      .set("X-Correlation-ID", uuid())
      .expect(202);

    await expect(TEST_DEVICE_REPOSITORY.find({ id: tmp.id })).rejects.toStrictEqual(
      expect.any(RepositoryEntityNotFoundError),
    );
  });

  test("PATCH /:id/name", async () => {
    await request(koa.callback())
      .patch(`/device/${device.id}/name`)
      .set("Authorization", `Bearer ${accessToken}`)
      .set("X-Correlation-ID", uuid())
      .send({
        name: "new-name",
      })
      .expect(204);

    await expect(TEST_DEVICE_REPOSITORY.find({ id: device.id })).resolves.toStrictEqual(
      expect.objectContaining({
        name: "new-name",
      }),
    );
  });

  test("PATCH /:id/pin", async () => {
    const oldSignature = device.pin.signature;

    await request(koa.callback())
      .patch(`/device/${device.id}/pin`)
      .set("Authorization", `Bearer ${accessToken}`)
      .set("X-Correlation-ID", uuid())
      .send({
        pin: "123456",
        updatedPin: "123456",
      })
      .expect(204);

    const result = await TEST_DEVICE_REPOSITORY.find({ id: device.id });

    expect(result.pin.signature).not.toBe(oldSignature);
  });

  test("PATCH /:id/secret", async () => {
    const oldSignature = device.secret;

    await request(koa.callback())
      .patch(`/device/${device.id}/secret`)
      .set("Authorization", `Bearer ${accessToken}`)
      .set("X-Correlation-ID", uuid())
      .send({
        pin: "123456",
        updatedSecret: getRandomValue(32),
      })
      .expect(204);

    const result = await TEST_DEVICE_REPOSITORY.find({ id: device.id });

    expect(result.secret).not.toBe(oldSignature);
  });
});
