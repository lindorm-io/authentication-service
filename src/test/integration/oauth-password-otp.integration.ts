import MockDate from "mockdate";
import request from "supertest";
import { Account } from "../../entity";
import { GrantType, MultiFactorChallengeType, ResponseType } from "../../enum";
import { Scope } from "@lindorm-io/jwt";
import { koa } from "../../server/koa";
import { v4 as uuid } from "uuid";
import {
  TEST_ACCOUNT_REPOSITORY,
  TEST_CLIENT,
  generateTestAccountOTP,
  generateTestOauthData,
  getGreyBoxAccountWithOTP,
  setupIntegration,
} from "../grey-box";

MockDate.set("2020-01-01 08:00:00.000");

describe("/oauth PASSWORD_OTP", () => {
  let account: Account;
  let otpCode: string;

  const { codeMethod, codeVerifier, codeChallenge, state } = generateTestOauthData();

  beforeAll(async () => {
    await setupIntegration();
    koa.load();
  });

  beforeEach(async () => {
    const { otp, bindingCode } = generateTestAccountOTP();
    account = await TEST_ACCOUNT_REPOSITORY.create(await getGreyBoxAccountWithOTP("test@lindorm.io", otp));
    otpCode = bindingCode;
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
        grant_type: GrantType.PASSWORD,
        redirect_uri: "https://redirect.uri/",
        response_type: [ResponseType.REFRESH, ResponseType.ACCESS].join(" "),
        scope: [Scope.DEFAULT, Scope.EDIT, Scope.OPENID].join(" "),
        state: state,
        subject: account.email,
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
      body: { token: authorizationToken },
    } = initResponse;

    const tokenMfaResponse = await request(koa.callback())
      .post("/oauth/token")
      .set("X-Client-ID", TEST_CLIENT.id)
      .set("X-Correlation-ID", uuid())
      .send({
        client_id: TEST_CLIENT.id,
        client_secret: TEST_CLIENT.secret,

        authorization_token: authorizationToken,

        code_verifier: codeVerifier,
        grant_type: GrantType.PASSWORD,
        password: "test_account_password",
        subject: account.email,
      })
      .expect(200);

    expect(tokenMfaResponse.body).toStrictEqual({
      multi_factor_token: {
        expires: 1577863800,
        expires_in: 1800,
        id: expect.any(String),
        token: expect.any(String),
      },
    });

    const {
      body: {
        multi_factor_token: { token: multiFactorToken },
      },
    } = tokenMfaResponse;

    const mfaChallengeResponse = await request(koa.callback())
      .post("/mfa/challenge")
      .set("X-Client-ID", TEST_CLIENT.id)
      .set("X-Correlation-ID", uuid())
      .send({
        client_id: TEST_CLIENT.id,
        client_secret: TEST_CLIENT.secret,

        multi_factor_token: multiFactorToken,

        challenge_type: MultiFactorChallengeType.OTP,
        grant_type: GrantType.PASSWORD,
        subject: account.email,
      })
      .expect(200);

    expect(mfaChallengeResponse.body).toStrictEqual({
      binding_method: "prompt",
      challenge_type: "otp",
    });

    const tokenResponse = await request(koa.callback())
      .post("/oauth/token")
      .set("X-Client-ID", TEST_CLIENT.id)
      .set("X-Correlation-ID", uuid())
      .send({
        client_id: TEST_CLIENT.id,
        client_secret: TEST_CLIENT.secret,

        multi_factor_token: multiFactorToken,

        binding_code: otpCode,
        grant_type: GrantType.MULTI_FACTOR_OTP,
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
