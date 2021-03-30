import MockDate from "mockdate";
import request from "supertest";
import { Account } from "../../entity";
import { GrantType, ResponseType } from "../../enum";
import { Scope } from "@lindorm-io/jwt";
import { koa } from "../../server/koa";
import { v4 as uuid } from "uuid";
import {
  TEST_ACCOUNT_REPOSITORY,
  TEST_CLIENT,
  TEST_KEY_PAIR_HANDLER,
  generateTestOauthData,
  getTestAccount,
  setupIntegration,
} from "../grey-box";

jest.mock("../../axios", () => ({
  requestCertificateChallenge: jest.fn(() => () => ({
    challengeId: "3588b6f3-d9cb-40d4-a885-bc5f4c762284",
    certificateChallenge: "CE9B988A76BB44ED8BD31F91FE016647",
  })),
  requestVerifyDevicePIN: jest.fn(() => () => undefined),
  requestOpenIdClaims: jest.fn(() => () => ({ claim: "claim" })),
}));

MockDate.set("2020-01-01 08:00:00.000");

describe("/oauth DEVICE_PIN", () => {
  let account: Account;

  const { codeMethod, codeVerifier, codeChallenge, state } = generateTestOauthData();

  beforeAll(async () => {
    await setupIntegration();
    koa.load();
  });

  beforeEach(async () => {
    account = await TEST_ACCOUNT_REPOSITORY.create(getTestAccount("test@lindorm.io"));
  });

  test("should resolve", async () => {
    const initResponse = await request(koa.callback())
      .post("/oauth/authorize")
      .set("X-Client-ID", TEST_CLIENT.id)
      .set("X-Correlation-ID", uuid())
      .set("X-Device-ID", "6c13e4ce-ec2e-40bf-addb-241a0c914295")
      .send({
        client_id: TEST_CLIENT.id,
        client_secret: "test_client_secret",

        code_challenge: codeChallenge,
        code_method: codeMethod,
        device_id: "6c13e4ce-ec2e-40bf-addb-241a0c914295",
        grant_type: GrantType.DEVICE_PIN,
        redirect_uri: "https://redirect.uri/",
        response_type: [ResponseType.REFRESH, ResponseType.ACCESS].join(" "),
        scope: [Scope.DEFAULT, Scope.EDIT, Scope.OPENID].join(" "),
        state: state,
        subject: account.email,
      })
      .expect(200);

    expect(initResponse.body).toStrictEqual({
      certificate_challenge: expect.any(String),
      expires: 1577864700,
      expires_in: 2700,
      redirect_uri: "https://redirect.uri/",
      state: state,
      token: expect.any(String),
    });

    const {
      body: { certificate_challenge: certificateChallenge, token },
    } = initResponse;

    const certificateVerifier = TEST_KEY_PAIR_HANDLER.sign(certificateChallenge);

    const tokenResponse = await request(koa.callback())
      .post("/oauth/token")
      .set("X-Client-ID", TEST_CLIENT.id)
      .set("X-Correlation-ID", uuid())
      .set("X-Device-ID", "6c13e4ce-ec2e-40bf-addb-241a0c914295")
      .send({
        client_id: TEST_CLIENT.id,
        client_secret: "test_client_secret",

        authorization_token: token,
        certificate_verifier: certificateVerifier,
        code_verifier: codeVerifier,
        device_id: "6c13e4ce-ec2e-40bf-addb-241a0c914295",
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
