import MockDate from "mockdate";
import request from "supertest";
import { Account, Device } from "../../entity";
import { GrantType, ResponseType } from "../../enum";
import { Scope } from "@lindorm-io/jwt";
import { koa } from "../../server/koa";
import { v4 as uuid } from "uuid";
import {
  TEST_ACCOUNT_REPOSITORY,
  TEST_CLIENT,
  TEST_DEVICE_REPOSITORY,
  TEST_KEY_PAIR_HANDLER,
  generateTestOauthData,
  getGreyBoxAccount,
  getGreyBoxDevice,
  setupIntegration,
} from "../grey-box";

MockDate.set("2020-01-01 08:00:00.000");

describe("/oauth DEVICE_PIN", () => {
  let account: Account;
  let device: Device;

  const { codeMethod, codeVerifier, codeChallenge, state } = generateTestOauthData();

  beforeAll(async () => {
    await setupIntegration();
    koa.load();
  });

  beforeEach(async () => {
    account = await TEST_ACCOUNT_REPOSITORY.create(getGreyBoxAccount("test@lindorm.io"));
    device = await TEST_DEVICE_REPOSITORY.create(await getGreyBoxDevice(account));
  });

  test("should resolve", async () => {
    const initResponse = await request(koa.callback())
      .post("/oauth/authorization")
      .set("X-Client-ID", TEST_CLIENT.id)
      .set("X-Correlation-ID", uuid())
      .send({
        client_id: TEST_CLIENT.id,
        client_secret: TEST_CLIENT.secret,

        device_id: device.id,

        code_challenge: codeChallenge,
        code_method: codeMethod,
        grant_type: GrantType.DEVICE_PIN,
        redirect_uri: "https://redirect.uri/",
        response_type: [ResponseType.REFRESH, ResponseType.ACCESS].join(" "),
        scope: [Scope.DEFAULT, Scope.EDIT, Scope.OPENID].join(" "),
        state: state,
        subject: account.email,
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

    const deviceVerifier = TEST_KEY_PAIR_HANDLER.sign(deviceChallenge);

    const tokenResponse = await request(koa.callback())
      .post("/oauth/token")
      .set("X-Client-ID", TEST_CLIENT.id)
      .set("X-Correlation-ID", uuid())
      .send({
        client_id: TEST_CLIENT.id,
        client_secret: TEST_CLIENT.secret,

        authorization_token: token,

        device_id: device.id,

        code_verifier: codeVerifier,
        device_verifier: deviceVerifier,
        grant_type: GrantType.DEVICE_PIN,
        pin: "123456",
        subject: account.email,
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
