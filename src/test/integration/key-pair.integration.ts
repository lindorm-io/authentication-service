import MockDate from "mockdate";
import request from "supertest";
import { Account } from "../../entity";
import { generateECCKeys, KeyPair, KeyType } from "@lindorm-io/key-pair";
import { koa } from "../../server/koa";
import { v4 as uuid } from "uuid";
import {
  TEST_ACCOUNT_REPOSITORY,
  TEST_CLIENT,
  TEST_KEY_PAIR_REPOSITORY,
  generateAccessToken,
  getTestAccountAdmin,
  setupIntegration,
} from "../grey-box";

MockDate.set("2020-01-01 08:00:00.000");

describe("/key-pair", () => {
  let account: Account;
  let accessToken: string;

  beforeAll(async () => {
    await setupIntegration();
    koa.load();
  });

  beforeEach(async () => {
    account = await TEST_ACCOUNT_REPOSITORY.create(getTestAccountAdmin("admin@lindorm.io"));
    accessToken = generateAccessToken(account);
  });

  test("POST /", async () => {
    const response = await request(koa.callback())
      .post("/key-pair/")
      .set("Authorization", `Bearer ${accessToken}`)
      .set("X-Client-ID", TEST_CLIENT.id)
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
    const tmp = await TEST_KEY_PAIR_REPOSITORY.create(new KeyPair(await generateECCKeys()));

    await request(koa.callback())
      .patch(`/key-pair/${tmp.id}/expire`)
      .set("Authorization", `Bearer ${accessToken}`)
      .set("X-Client-ID", TEST_CLIENT.id)
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
