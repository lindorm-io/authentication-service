import MockDate from "mockdate";
import request from "supertest";
import { GrantType, ResponseType } from "../../enum";
import { Scope } from "@lindorm-io/jwt";
import { koa } from "../../server/koa";
import { v4 as uuid } from "uuid";
import {
  TEST_ACCOUNT,
  TEST_CLIENT,
  TEST_DEVICE,
  generateTestOauthData,
  loadMongoConnection,
  loadRedisConnection,
} from "../grey-box";

MockDate.set("2020-01-01 08:00:00.000");

describe("/oauth DEVICE_PIN", () => {
  const { codeMethod, codeVerifier, codeChallenge, state } = generateTestOauthData();

  beforeAll(async () => {
    await loadMongoConnection();
    await loadRedisConnection();
    koa.load();
  });

  test("should resolve", async () => {
    const initResponse = await request(koa.callback())
      .post("/oauth/authorization")
      .set("X-Correlation-ID", uuid())
      .send({
        client_id: TEST_CLIENT.id,
        client_secret: TEST_CLIENT.secret,

        device_id: TEST_DEVICE.id,

        code_challenge: codeChallenge,
        code_method: codeMethod,
        grant_type: GrantType.DEVICE_PIN,
        redirect_uri: "https://redirect.uri/",
        response_type: [ResponseType.REFRESH, ResponseType.ACCESS].join(" "),
        scope: [Scope.DEFAULT, Scope.EDIT, Scope.OPENID].join(" "),
        state: state,
        subject: TEST_ACCOUNT.email,
      })
      .expect(200);

    expect(initResponse.body).toStrictEqual({
      device_challenge: expect.any(String),
      expires: 1577864700,
      expires_in: 2700,
      redirect_uri: "https://redirect.uri/",
      state: state,
      token: expect.any(String),
    });

    const {
      body: { device_challenge: deviceChallenge, token },
    } = initResponse;

    const deviceVerifier = TEST_DEVICE.handler.sign(deviceChallenge);

    const tokenResponse = await request(koa.callback())
      .post("/oauth/token")
      .set("X-Correlation-ID", uuid())
      .send({
        client_id: TEST_CLIENT.id,
        client_secret: TEST_CLIENT.secret,

        authorization_token: token,

        device_id: TEST_DEVICE.id,

        code_verifier: codeVerifier,
        device_verifier: deviceVerifier,
        grant_type: GrantType.DEVICE_PIN,
        pin: TEST_DEVICE.pin,
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

  test("should throw error when client is missing", async () => {
    const result = await request(koa.callback())
      .post("/oauth/authorization")
      .set("X-Correlation-ID", uuid())
      .send({
        // client_id: TEST_CLIENT.id,
        // client_secret: TEST_CLIENT.secret,

        device_id: TEST_DEVICE.id,

        code_challenge: codeChallenge,
        code_method: codeMethod,
        grant_type: GrantType.DEVICE_PIN,
        redirect_uri: "https://redirect.uri/",
        response_type: [ResponseType.REFRESH, ResponseType.ACCESS].join(" "),
        scope: [Scope.DEFAULT, Scope.EDIT, Scope.OPENID].join(" "),
        state: state,
        subject: TEST_ACCOUNT.email,
      })
      .expect(403);

    expect(result.body).toStrictEqual({
      error: {
        code: null,
        data: {
          back_off_until: null,
          failed_tries: 1,
        },
        details: [
          {
            context: {
              key: "clientId",
              label: "clientId",
            },
            message: '"clientId" is required',
            path: ["clientId"],
            type: "any.required",
          },
        ],
        message: "This request failed and has been rate-limited",
        name: "RequestLimitFailedTryError",
        title: null,
      },
    });
  });

  test("should throw error when device is missing", async () => {
    const result = await request(koa.callback())
      .post("/oauth/authorization")
      .set("X-Correlation-ID", uuid())
      .send({
        client_id: TEST_CLIENT.id,
        client_secret: TEST_CLIENT.secret,

        // device_id: TEST_DEVICE.id,

        code_challenge: codeChallenge,
        code_method: codeMethod,
        grant_type: GrantType.DEVICE_PIN,
        redirect_uri: "https://redirect.uri/",
        response_type: [ResponseType.REFRESH, ResponseType.ACCESS].join(" "),
        scope: [Scope.DEFAULT, Scope.EDIT, Scope.OPENID].join(" "),
        state: state,
        subject: TEST_ACCOUNT.email,
      })
      .expect(403);

    expect(result.body).toStrictEqual({
      error: {
        code: null,
        data: {
          back_off_until: null,
          failed_tries: 2,
        },
        details: "Device not found",
        message: "This request failed and has been rate-limited",
        name: "RequestLimitFailedTryError",
        title: null,
      },
    });
  });
});
