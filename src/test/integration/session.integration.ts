import MockDate from "mockdate";
import request from "supertest";
import { Audience, GrantType, ResponseType, Scope } from "../../enum";
import { JWT_ACCESS_TOKEN_EXPIRY } from "../../config";
import { RepositoryEntityNotFoundError } from "@lindorm-io/mongo";
import { Session } from "../../entity";
import { koa } from "../../server/koa";
import { v4 as uuid } from "uuid";
import {
  TEST_ACCOUNT,
  TEST_CLIENT,
  TEST_SESSION_REPOSITORY,
  TEST_TOKEN_ISSUER,
  generateTestOauthData,
  loadMongoConnection,
  loadRedisConnection,
} from "../grey-box";

MockDate.set("2020-01-01 08:00:00.000");

describe("/session", () => {
  const { codeMethod, codeChallenge } = generateTestOauthData();

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

  test("POST /logout", async () => {
    const session = await TEST_SESSION_REPOSITORY.create(
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
        scope: Scope.DEFAULT,
      }),
    );
    const { token: refreshToken } = TEST_TOKEN_ISSUER.sign({
      audience: Audience.REFRESH,
      clientId: TEST_CLIENT.id,
      expiry: session.expires,
      id: session.refreshId,
      permission: TEST_ACCOUNT.permission,
      scope: Scope.DEFAULT,
      subject: session.id,
    });

    await request(koa.callback())
      .post("/session/logout/")
      .set("Authorization", `Bearer ${accessToken}`)
      .set("X-Correlation-ID", uuid())
      .send({
        client_id: TEST_CLIENT.id,
        client_secret: TEST_CLIENT.secret,

        refresh_token: refreshToken,
      })
      .expect(202);

    await expect(TEST_SESSION_REPOSITORY.find({ id: session.id })).rejects.toStrictEqual(
      expect.any(RepositoryEntityNotFoundError),
    );
  });

  test("DELETE /:id", async () => {
    const session = await TEST_SESSION_REPOSITORY.create(
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
        scope: Scope.DEFAULT,
      }),
    );

    await request(koa.callback())
      .delete(`/session/${session.id}`)
      .set("Authorization", `Bearer ${accessToken}`)
      .set("X-Correlation-ID", uuid())
      .send({
        client_id: TEST_CLIENT.id,
        client_secret: TEST_CLIENT.secret,
      })
      .expect(202);

    await expect(TEST_SESSION_REPOSITORY.find({ id: session.id })).rejects.toStrictEqual(
      expect.any(RepositoryEntityNotFoundError),
    );
  });
});
