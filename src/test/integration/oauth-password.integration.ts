import MockDate from "mockdate";
import request from "supertest";
import { Account } from "../../entity";
import { GrantType, ResponseType } from "../../enum";
import { MOCK_CODE_VERIFIER } from "../mocks";
import { encryptAccountPassword } from "../../support";
import { koa } from "../../server/koa";
import { v4 as uuid } from "uuid";
import {
  TEST_ACCOUNT_REPOSITORY,
  TEST_CLIENT_ID,
  TEST_CLIENT_SECRET,
  loadMongoConnection,
} from "../connection/mongo-connection";

MockDate.set("2020-01-01 08:00:00.000");

describe("/oauth PASSWORD", () => {
  beforeAll(async () => {
    await loadMongoConnection();

    koa.load();

    await TEST_ACCOUNT_REPOSITORY.create(
      new Account({
        email: "test@lindorm.io",
        password: { signature: await encryptAccountPassword("password"), updated: new Date() },
      }),
    );
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
      body: { token },
    } = initResponse;

    const tokenResponse = await request(koa.callback())
      .post("/oauth/token")
      .set("X-Correlation-ID", uuid())
      .send({
        client_id: TEST_CLIENT_ID,
        client_secret: TEST_CLIENT_SECRET,

        authorization_token: token,

        code_verifier: MOCK_CODE_VERIFIER,
        grant_type: GrantType.PASSWORD,
        password: "password",
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
