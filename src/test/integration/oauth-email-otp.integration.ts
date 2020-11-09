import MockDate from "mockdate";
import request from "supertest";
import { Client } from "../../entity";
import { GrantType, ResponseType } from "../../enum";
import { KeyPair } from "@lindorm-io/key-pair";
import { MOCK_CODE_VERIFIER, MOCK_KEY_PAIR_OPTIONS } from "../mocks";
import { clientInMemory, keyPairInMemory } from "../../middleware";
import { emailInMemory, encryptClientSecret } from "../../support";
import { getRandomValue } from "@lindorm-io/core";
import { koa } from "../../server/koa";
import { v4 as uuid } from "uuid";

MockDate.set("2020-01-01 08:00:00.000");

describe("/oauth EMAIL_OTP", () => {
  const clientId = uuid();
  const clientSecret = getRandomValue(16);

  beforeAll(async () => {
    koa.load();

    await clientInMemory.create(
      new Client({
        id: clientId,
        secret: await encryptClientSecret(clientSecret),
        approved: true,
        emailAuthorizationUri: "https://lindorm.io/",
      }),
    );

    await keyPairInMemory.create(new KeyPair(MOCK_KEY_PAIR_OPTIONS));
  });

  test("should resolve", async () => {
    const initResponse = await request(koa.callback())
      .post("/oauth/authorization")
      .set("X-Correlation-ID", uuid())
      .send({
        client_id: clientId,
        client_secret: clientSecret,

        code_challenge: "H4LnTn7e1DltMsohJgIeKSNgpvppJ1qP6QRRD9Ai1pw=",
        code_method: "sha256",
        grant_type: GrantType.EMAIL_OTP,
        redirect_uri: "https://redirect.uri/",
        response_type: [ResponseType.REFRESH, ResponseType.ACCESS].join(" "),
        scope: "default",
        state: "MsohJgIeKSNgpvpp",
        subject: "test@lindorm.io",
      })
      .expect(200);

    expect(initResponse.body).toStrictEqual({
      expires: 1577862900,
      expires_in: 900,
      redirect_uri: "https://redirect.uri/",
      state: "MsohJgIeKSNgpvpp",
      token: expect.any(String),
    });

    const {
      body: { token },
    } = initResponse;

    const { otpCode } = emailInMemory[0];

    const tokenResponse = await request(koa.callback())
      .post("/oauth/token")
      .set("X-Correlation-ID", uuid())
      .send({
        client_id: clientId,
        client_secret: clientSecret,

        authorization_token: token,

        code_verifier: MOCK_CODE_VERIFIER,
        grant_type: GrantType.EMAIL_OTP,
        otp_code: otpCode,
        subject: "test@lindorm.io",
      })
      .expect(200);

    expect(tokenResponse.body).toStrictEqual({
      access_token: {
        expires: 1577862180,
        expires_in: 180,
        id: expect.any(String),
        token: expect.any(String),
      },
      refresh_token: {
        expires: 1579071600,
        expires_in: 1209600,
        id: expect.any(String),
        token: expect.any(String),
      },
    });
  });
});
