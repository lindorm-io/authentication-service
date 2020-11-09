import MockDate from "mockdate";
import request from "supertest";
import { Account, Client, Device } from "../../entity";
import { Audience, Permission, Scope } from "../../enum";
import { JWT_ACCESS_TOKEN_EXPIRY, JWT_ISSUER } from "../../config";
import { generateRSAKeys, KeyPair, Keystore } from "@lindorm-io/key-pair";
import { MOCK_KEY_PAIR_OPTIONS } from "../mocks";
import { TokenIssuer } from "@lindorm-io/jwt";
import { accountInMemory, clientInMemory, deviceInMemory, keyPairInMemory } from "../../middleware";
import { encryptAccountPassword, encryptClientSecret, encryptDevicePIN } from "../../support";
import { getRandomValue } from "@lindorm-io/core";
import { koa } from "../../server/koa";
import { v4 as uuid } from "uuid";
import { winston } from "../../logger";
import { RepositoryEntityNotFoundError } from "@lindorm-io/mongo";

MockDate.set("2020-01-01 08:00:00.000");

describe("/device", () => {
  let account: Account;
  let device: Device;
  let accessToken: string;
  let publicKey: string;

  beforeAll(async () => {
    koa.load();

    const client = await clientInMemory.create(
      new Client({
        secret: await encryptClientSecret("secret"),
        approved: true,
        emailAuthorizationUri: "https://lindorm.io/",
      }),
    );

    account = await accountInMemory.create(
      new Account({
        email: "test@lindorm.io",
        password: { signature: await encryptAccountPassword("password"), updated: new Date() },
        permission: Permission.ADMIN,
      }),
    );

    ({ publicKey } = await generateRSAKeys(""));

    device = await deviceInMemory.create(
      new Device({
        accountId: account.id,
        pin: {
          signature: await encryptDevicePIN("123456"),
          updated: new Date(),
        },
        publicKey,
      }),
    );

    const keyPair = await keyPairInMemory.create(new KeyPair(MOCK_KEY_PAIR_OPTIONS));

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

    await expect(deviceInMemory.find({ id: response.body.device_id })).resolves.toStrictEqual(
      expect.objectContaining({
        id: response.body.device_id,
      }),
    );
  });

  test("DELETE /:id", async () => {
    const tmp = await deviceInMemory.create(
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

    await expect(deviceInMemory.find({ id: tmp.id })).rejects.toStrictEqual(expect.any(RepositoryEntityNotFoundError));
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

    await expect(deviceInMemory.find({ id: device.id })).resolves.toStrictEqual(
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

    const result = await deviceInMemory.find({ id: device.id });

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

    const result = await deviceInMemory.find({ id: device.id });

    expect(result.secret).not.toBe(oldSignature);
  });
});
