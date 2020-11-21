import MockDate from "mockdate";
import request from "supertest";
import { GrantType, ResponseType } from "../../enum";
import { Scope } from "@lindorm-io/jwt";
import { koa } from "../../server/koa";
import { v4 as uuid } from "uuid";
import { emailInMemory } from "../../support";
import {
  TEST_ACCOUNT,
  TEST_CLIENT,
  generateTestOauthData,
  loadMongoConnection,
  loadRedisConnection,
} from "../grey-box";

MockDate.set("2020-01-01 08:00:00.000");

describe("/oauth EMAIL_OTP", () => {
  const { codeMethod, codeVerifier, codeChallenge, state } = generateTestOauthData();

  beforeAll(async () => {
    await loadMongoConnection();
    await loadRedisConnection();
    koa.load();
  });

  test("should resolve", async () => {
    const initResponse = await request(koa.callback())
      .post("/oauth/authorization")
      .set("X-Client-ID", TEST_CLIENT.id)
      .set("X-Correlation-ID", uuid())
      .send({
        client_id: TEST_CLIENT.id,
        client_secret: TEST_CLIENT.secret,

        code_challenge: codeChallenge,
        code_method: codeMethod,
        grant_type: GrantType.EMAIL_OTP,
        redirect_uri: "https://redirect.uri/",
        response_type: [ResponseType.REFRESH, ResponseType.ACCESS].join(" "),
        scope: [Scope.DEFAULT, Scope.EDIT, Scope.OPENID].join(" "),
        state: state,
        subject: TEST_ACCOUNT.email,
      })
      .expect(200);

    expect(initResponse.body).toStrictEqual({
      expires: 1577864700,
      expires_in: 2700,
      redirect_uri: "https://redirect.uri/",
      state: state,
      token: expect.any(String),
    });

    const {
      body: { token },
    } = initResponse;

    const { otpCode } = emailInMemory[0];

    const tokenResponse = await request(koa.callback())
      .post("/oauth/token")
      .set("X-Client-ID", TEST_CLIENT.id)
      .set("X-Correlation-ID", uuid())
      .send({
        client_id: TEST_CLIENT.id,
        client_secret: TEST_CLIENT.secret,

        authorization_token: token,

        code_verifier: codeVerifier,
        grant_type: GrantType.EMAIL_OTP,
        otp_code: otpCode,
        subject: TEST_ACCOUNT.email,
      })
      .expect(200);

    expect(tokenResponse.body).toStrictEqual({
      access_token: {
        expires: 1577862120,
        expires_in: 120,
        id: expect.any(String),
        token: expect.any(String),
      },
      refresh_token: {
        expires: 1577948400,
        expires_in: 86400,
        id: expect.any(String),
        token: expect.any(String),
      },
    });
  });
});
