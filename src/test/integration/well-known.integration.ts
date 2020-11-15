import MockDate from "mockdate";
import request from "supertest";
import { koa } from "../../server/koa";
import { v4 as uuid } from "uuid";
import { loadMongoConnection, loadRedisConnection, TEST_KEY_PAIR_REPOSITORY } from "../grey-box";

MockDate.set("2020-01-01 08:00:00.000");

describe("/.well-known", () => {
  beforeAll(async () => {
    await loadMongoConnection();
    await loadRedisConnection();
    koa.load();
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

    const [keyPair] = await TEST_KEY_PAIR_REPOSITORY.findMany({});

    expect(response.body).toStrictEqual({
      keys: [
        {
          alg: "ES512",
          c: 1577862000,
          e: "AQAB",
          exp: null,
          kid: keyPair.id,
          kty: "ec",
          n: keyPair.publicKey,
          use: "sig",
        },
      ],
    });
  });
});
