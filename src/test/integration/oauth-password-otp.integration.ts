import MockDate from "mockdate";
import request from "supertest";
import { Account } from "../../entity";
import { CryptoAES } from "@lindorm-io/crypto";
import { GrantType, MultiFactorChallengeType, ResponseType } from "../../enum";
import { MOCK_CODE_VERIFIER } from "../mocks";
import { OTP_HANDLER_OPTIONS } from "../../config";
import { authenticator } from "otplib";
import { baseParse } from "@lindorm-io/core";
import { encryptAccountPassword, generateAccountOTP } from "../../support";
import { koa } from "../../server/koa";
import { v4 as uuid } from "uuid";
import {
  TEST_ACCOUNT_REPOSITORY,
  TEST_CLIENT_ID,
  TEST_CLIENT_SECRET,
  loadMongoConnection,
} from "../connection/mongo-connection";

MockDate.set("2020-01-01 08:00:00.000");

describe("/oauth PASSWORD_OTP", () => {
  let otpSecret: string;

  beforeAll(async () => {
    await loadMongoConnection();

    koa.load();

    const account = await TEST_ACCOUNT_REPOSITORY.create(
      new Account({
        email: "test@lindorm.io",
        password: { signature: await encryptAccountPassword("password"), updated: new Date() },
        otp: generateAccountOTP(),
      }),
    );

    const aes = new CryptoAES({
      secret: OTP_HANDLER_OPTIONS.secret,
    });

    otpSecret = aes.decrypt(baseParse(account.otp.signature));
  });

  test("should resolve", async () => {
    const initResponse = await request(koa.callback())
      .post("/oauth/authorization")
      .set("X-Correlation-ID", uuid())
      .send({
        client_id: TEST_CLIENT_ID,
        client_secret: TEST_CLIENT_SECRET,

        code_challenge: "H4LnTn7e1DltMsohJgIeKSNgpvppJ1qP6QRRD9Ai1pw=",
        code_method: "sha256",
        grant_type: GrantType.PASSWORD,
        redirect_uri: "https://redirect.uri/",
        response_type: [ResponseType.REFRESH, ResponseType.ACCESS].join(" "),
        scope: "default",
        state: "MsohJgIeKSNgpvpp",
        subject: "test@lindorm.io",
      })
      .expect(200);

    expect(initResponse.body).toStrictEqual({
      expires: 1577864700,
      expires_in: 2700,
      redirect_uri: "https://redirect.uri/",
      state: "MsohJgIeKSNgpvpp",
      token: expect.any(String),
    });

    const {
      body: { token: authorizationToken },
    } = initResponse;

    const tokenMfaResponse = await request(koa.callback())
      .post("/oauth/token")
      .set("X-Correlation-ID", uuid())
      .send({
        client_id: TEST_CLIENT_ID,
        client_secret: TEST_CLIENT_SECRET,

        authorization_token: authorizationToken,

        code_verifier: MOCK_CODE_VERIFIER,
        grant_type: GrantType.PASSWORD,
        password: "password",
        subject: "test@lindorm.io",
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
      .set("X-Correlation-ID", uuid())
      .send({
        client_id: TEST_CLIENT_ID,
        client_secret: TEST_CLIENT_SECRET,

        multi_factor_token: multiFactorToken,

        challenge_type: MultiFactorChallengeType.OTP,
        grant_type: GrantType.PASSWORD,
        subject: "test@lindorm.io",
      })
      .expect(200);

    expect(mfaChallengeResponse.body).toStrictEqual({
      binding_method: "prompt",
      challenge_type: "otp",
    });

    const bindingCode = authenticator.generate(otpSecret);

    const tokenResponse = await request(koa.callback())
      .post("/oauth/token")
      .set("X-Correlation-ID", uuid())
      .send({
        client_id: TEST_CLIENT_ID,
        client_secret: TEST_CLIENT_SECRET,

        multi_factor_token: multiFactorToken,

        binding_code: bindingCode,
        grant_type: GrantType.MULTI_FACTOR_OTP,
        subject: "test@lindorm.io",
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
