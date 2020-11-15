import MockDate from "mockdate";
import request from "supertest";
import { generateECCKeys, generateRSAKeys, KeyPair } from "@lindorm-io/key-pair";
import { koa } from "../../server/koa";
import { v4 as uuid } from "uuid";
import { TEST_KEY_PAIR_REPOSITORY, loadMongoConnection, loadRedisConnection } from "../grey-box";

MockDate.set("2020-01-01 08:00:00.000");

describe("/.well-known", () => {
  let rsaKeyPair: KeyPair;
  let ecKeyPair: KeyPair;

  beforeAll(async () => {
    await loadMongoConnection();
    await loadRedisConnection();
    koa.load();

    rsaKeyPair = await TEST_KEY_PAIR_REPOSITORY.create(new KeyPair(await generateRSAKeys()));
    ecKeyPair = await TEST_KEY_PAIR_REPOSITORY.create(new KeyPair(await generateECCKeys()));
  });

  test("GET /openid-configuration", async () => {
    const response = await request(koa.callback())
      .get(`/.well-known/openid-configuration`)
      .set("X-Correlation-ID", uuid())
      .expect(200);

    expect(response.body).toMatchSnapshot();
  });

  test("GET /jwks", async () => {
    const response = await request(koa.callback()).get(`/.well-known/jwks`).set("X-Correlation-ID", uuid()).expect(200);

    expect(response.body).toStrictEqual({
      keys: [
        {
          alg: "ES512",
          c: 1577862000,
          e: "AQAB",
          exp: null,
          kid: expect.any(String),
          kty: "ec",
          n: expect.any(String),
          use: "sig",
        },
        {
          alg: rsaKeyPair.algorithm,
          c: 1577862000,
          e: "AQAB",
          exp: null,
          kid: rsaKeyPair.id,
          kty: rsaKeyPair.type,
          n: rsaKeyPair.publicKey,
          use: "sig",
        },
        {
          alg: ecKeyPair.algorithm,
          c: 1577862000,
          e: "AQAB",
          exp: null,
          kid: ecKeyPair.id,
          kty: ecKeyPair.type,
          n: ecKeyPair.publicKey,
          use: "sig",
        },
      ],
    });
  });
});
