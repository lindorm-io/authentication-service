import MockDate from "mockdate";
import request from "supertest";
import { Audience, Scope } from "../../enum";
import { JWT_ACCESS_TOKEN_EXPIRY } from "../../config";
import { koa } from "../../server/koa";
import { v4 as uuid } from "uuid";
import { TEST_ACCOUNT, TEST_CLIENT, TEST_TOKEN_ISSUER, loadMongoConnection, loadRedisConnection } from "../grey-box";

MockDate.set("2020-01-01 08:00:00.000");

describe("/user-info", () => {
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

  test("GET /", async () => {
    const response = await request(koa.callback())
      .get(`/userinfo`)
      .set("Authorization", `Bearer ${accessToken}`)
      .set("X-Correlation-ID", uuid())
      .expect(200);

    expect(response.body).toStrictEqual({
      email: TEST_ACCOUNT.email,
      email_verified: true,
      sub: TEST_ACCOUNT.id,
      updated_at: 1577862000,
    });
  });
});
