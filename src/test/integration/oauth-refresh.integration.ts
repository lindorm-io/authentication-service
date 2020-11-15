import MockDate from "mockdate";
import request from "supertest";
import { Audience, GrantType, ResponseType } from "../../enum";
import { Scope } from "@lindorm-io/jwt";
import { Session } from "../../entity";
import { koa } from "../../server/koa";
import { v4 as uuid } from "uuid";
import {
  TEST_ACCOUNT,
  TEST_CLIENT,
  generateTestOauthData,
  loadMongoConnection,
  loadRedisConnection,
  TEST_SESSION_REPOSITORY,
  TEST_TOKEN_ISSUER,
} from "../grey-box";

MockDate.set("2020-01-01 08:00:00.000");

describe("/oauth REFRESH_TOKEN", () => {
  const { codeMethod, codeChallenge } = generateTestOauthData();
  let session: Session;
  let refreshToken: string;

  beforeAll(async () => {
    await loadMongoConnection();
    await loadRedisConnection();
    koa.load();

    session = await TEST_SESSION_REPOSITORY.create(
      new Session({
        accountId: TEST_ACCOUNT.id,
        authenticated: true,
        authorization: {
          codeChallenge: codeChallenge,
          codeMethod: codeMethod,
          email: TEST_ACCOUNT.email,
          id: uuid(),
          redirectUri: "https://redirect.uri/",
          responseType: ResponseType.REFRESH,
        },
        clientId: TEST_CLIENT.id,
        expires: new Date("2099-01-01"),
        grantType: GrantType.EMAIL_OTP,
        refreshId: uuid(),
        scope: [Scope.DEFAULT, Scope.EDIT, Scope.OPENID].join(" "),
      }),
    );

    ({ token: refreshToken } = TEST_TOKEN_ISSUER.sign({
      audience: Audience.REFRESH,
      authMethodsReference: "email",
      clientId: TEST_CLIENT.id,
      expiry: session.expires,
      id: session.refreshId,
      permission: TEST_ACCOUNT.permission,
      scope: [Scope.DEFAULT, Scope.EDIT, Scope.OPENID].join(" "),
      subject: session.id,
    }));
  });

  test("should resolve", async () => {
    const response = await request(koa.callback())
      .post("/oauth/token")
      .set("X-Correlation-ID", uuid())
      .send({
        client_id: TEST_CLIENT.id,
        client_secret: TEST_CLIENT.secret,

        refresh_token: refreshToken,

        grant_type: GrantType.REFRESH_TOKEN,
        subject: TEST_ACCOUNT.email,
        response_type: [ResponseType.REFRESH, ResponseType.ACCESS].join(" "),
      })
      .expect(200);

    expect(response.body).toStrictEqual({
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

    await expect(TEST_SESSION_REPOSITORY.find({ id: session.id })).resolves.toStrictEqual(
      expect.objectContaining({
        refreshId: response.body.refresh_token.id,
      }),
    );
  });
});
