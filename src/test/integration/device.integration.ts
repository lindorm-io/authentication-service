import MockDate from "mockdate";
import request from "supertest";
import { Audience, Scope } from "../../enum";
import { JWT_ACCESS_TOKEN_EXPIRY } from "../../config";
import { getRandomValue } from "@lindorm-io/core";
import { koa } from "../../server/koa";
import { v4 as uuid } from "uuid";
import {
  TEST_ACCOUNT,
  TEST_CLIENT,
  TEST_DEVICE,
  TEST_DEVICE_REPOSITORY,
  TEST_TOKEN_ISSUER,
  loadMongoConnection,
  loadRedisConnection,
} from "../grey-box";
import { Device } from "../../entity";
import { encryptDevicePIN } from "../../support/device";
import { RepositoryEntityNotFoundError } from "@lindorm-io/mongo";

MockDate.set("2020-01-01 08:00:00.000");

describe("/device", () => {
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
      .post("/device/")
      .set("Authorization", `Bearer ${accessToken}`)
      .set("X-Correlation-ID", uuid())
      .send({
        name: "name",
        pin: "123456",
        public_key: TEST_DEVICE.device.publicKey,
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
        accountId: TEST_ACCOUNT.id,
        pin: {
          signature: await encryptDevicePIN("123456"),
          updated: new Date(),
        },
        publicKey: TEST_DEVICE.device.publicKey,
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
      .patch(`/device/${TEST_DEVICE.id}/name`)
      .set("Authorization", `Bearer ${accessToken}`)
      .set("X-Correlation-ID", uuid())
      .send({
        name: "new-name",
      })
      .expect(204);

    await expect(TEST_DEVICE_REPOSITORY.find({ id: TEST_DEVICE.id })).resolves.toStrictEqual(
      expect.objectContaining({
        name: "new-name",
      }),
    );
  });

  test("PATCH /:id/pin", async () => {
    const oldSignature = TEST_DEVICE.device.pin.signature;

    await request(koa.callback())
      .patch(`/device/${TEST_DEVICE.id}/pin`)
      .set("Authorization", `Bearer ${accessToken}`)
      .set("X-Correlation-ID", uuid())
      .send({
        pin: TEST_DEVICE.pin,
        updatedPin: TEST_DEVICE.pin,
      })
      .expect(204);

    const result = await TEST_DEVICE_REPOSITORY.find({ id: TEST_DEVICE.id });

    expect(result.pin.signature).not.toBe(oldSignature);
  });

  test("PATCH /:id/secret", async () => {
    const oldSignature = TEST_DEVICE.device.secret;

    await request(koa.callback())
      .patch(`/device/${TEST_DEVICE.id}/secret`)
      .set("Authorization", `Bearer ${accessToken}`)
      .set("X-Correlation-ID", uuid())
      .send({
        pin: TEST_DEVICE.pin,
        updatedSecret: getRandomValue(32),
      })
      .expect(204);

    const result = await TEST_DEVICE_REPOSITORY.find({ id: TEST_DEVICE.id });

    expect(result.secret).not.toBe(oldSignature);
  });
});
