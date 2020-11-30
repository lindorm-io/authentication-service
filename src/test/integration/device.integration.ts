import MockDate from "mockdate";
import request from "supertest";
import { Account, Device } from "../../entity";
import { RepositoryEntityNotFoundError } from "@lindorm-io/mongo";
import { koa } from "../../server/koa";
import { v4 as uuid } from "uuid";
import {
  TEST_ACCOUNT_REPOSITORY,
  TEST_CLIENT,
  TEST_DEVICE_REPOSITORY,
  getGreyBoxAccessToken,
  getGreyBoxAccount,
  getGreyBoxDevice,
  setupIntegration,
} from "../grey-box";

MockDate.set("2020-01-01 08:00:00.000");

describe("/device", () => {
  let account: Account;
  let device: Device;
  let accessToken: string;

  beforeAll(async () => {
    await setupIntegration();
    koa.load();
  });

  beforeEach(async () => {
    account = await TEST_ACCOUNT_REPOSITORY.create(getGreyBoxAccount("test@lindorm.io"));
    device = await TEST_DEVICE_REPOSITORY.create(await getGreyBoxDevice(account));
    accessToken = getGreyBoxAccessToken(account);
  });

  test("POST /", async () => {
    const response = await request(koa.callback())
      .post("/device/")
      .set("Authorization", `Bearer ${accessToken}`)
      .set("X-Client-ID", TEST_CLIENT.id)
      .set("X-Correlation-ID", uuid())
      .send({
        name: "name",
        pin: "123456",
        public_key: device.publicKey,
        secret: "test_device_secret",
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
    await request(koa.callback())
      .delete(`/device/${device.id}`)
      .set("Authorization", `Bearer ${accessToken}`)
      .set("X-Client-ID", TEST_CLIENT.id)
      .set("X-Correlation-ID", uuid())
      .expect(202);

    await expect(TEST_DEVICE_REPOSITORY.find({ id: device.id })).rejects.toStrictEqual(
      expect.any(RepositoryEntityNotFoundError),
    );
  });

  test("PATCH /:id/name", async () => {
    await request(koa.callback())
      .patch(`/device/${device.id}/name`)
      .set("Authorization", `Bearer ${accessToken}`)
      .set("X-Client-ID", TEST_CLIENT.id)
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
      .set("X-Client-ID", TEST_CLIENT.id)
      .set("X-Correlation-ID", uuid())
      .send({
        pin: "123456",
        updatedPin: "987654",
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
      .set("X-Client-ID", TEST_CLIENT.id)
      .set("X-Correlation-ID", uuid())
      .send({
        pin: "123456",
        updatedSecret: "test_device_secret",
      })
      .expect(204);

    const result = await TEST_DEVICE_REPOSITORY.find({ id: device.id });

    expect(result.secret).not.toBe(oldSignature);
  });
});
