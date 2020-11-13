import MockDate from "mockdate";
import request from "supertest";
import { Account, Session } from "../../entity";
import { Audience, GrantType, Permission, ResponseType, Scope } from "../../enum";
import { JWT_ACCESS_TOKEN_EXPIRY, JWT_ISSUER } from "../../config";
import { KeyPair, Keystore } from "@lindorm-io/key-pair";
import { MOCK_KEY_PAIR_OPTIONS } from "../mocks";
import { RepositoryEntityNotFoundError } from "@lindorm-io/mongo";
import { TokenIssuer } from "@lindorm-io/jwt";
import { encryptAccountPassword } from "../../support";
import { koa } from "../../server/koa";
import { v4 as uuid } from "uuid";
import { winston } from "../../logger";
import {
  TEST_ACCOUNT_REPOSITORY,
  TEST_CLIENT_ID,
  TEST_CLIENT_SECRET,
  TEST_KEY_PAIR_REPOSITORY,
  TEST_SESSION_REPOSITORY,
  loadMongoConnection,
} from "../connection/mongo-connection";

MockDate.set("2020-01-01 08:00:00.000");

describe("/session", () => {
  let account: Account;
  let tokenIssuer: TokenIssuer;
  let accessToken: string;

  beforeAll(async () => {
    await loadMongoConnection();

    koa.load();

    account = await TEST_ACCOUNT_REPOSITORY.create(
      new Account({
        email: "test@lindorm.io",
        password: { signature: await encryptAccountPassword("password"), updated: new Date() },
        permission: Permission.ADMIN,
      }),
    );

    const keyPair = await TEST_KEY_PAIR_REPOSITORY.create(new KeyPair(MOCK_KEY_PAIR_OPTIONS));

    tokenIssuer = new TokenIssuer({
      issuer: JWT_ISSUER,
      logger: winston,
      keystore: new Keystore({ keys: [keyPair] }),
    });

    ({ token: accessToken } = tokenIssuer.sign({
      audience: Audience.ACCESS,
      clientId: TEST_CLIENT_ID,
      expiry: JWT_ACCESS_TOKEN_EXPIRY,
      permission: account.permission,
      scope: [Scope.DEFAULT, Scope.OPENID].join(" "),
      subject: account.id,
    }));
  });

  test("POST /logout", async () => {
    const session = await TEST_SESSION_REPOSITORY.create(
      new Session({
        accountId: account.id,
        authenticated: true,
        authorization: {
          codeChallenge: "H4LnTn7e1DltMsohJgIeKSNgpvppJ1qP6QRRD9Ai1pw=",
          codeMethod: "sha256",
          email: account.email,
          id: uuid(),
          redirectUri: "https://redirect.uri/",
          responseType: ResponseType.REFRESH,
        },
        clientId: TEST_CLIENT_ID,
        expires: new Date("2099-01-01"),
        grantType: GrantType.EMAIL_OTP,
        refreshId: uuid(),
        scope: Scope.DEFAULT,
      }),
    );
    const { token: refreshToken } = tokenIssuer.sign({
      audience: Audience.REFRESH,
      clientId: TEST_CLIENT_ID,
      expiry: session.expires,
      id: session.refreshId,
      permission: account.permission,
      scope: Scope.DEFAULT,
      subject: session.id,
    });

    await request(koa.callback())
      .post("/session/logout/")
      .set("Authorization", `Bearer ${accessToken}`)
      .set("X-Correlation-ID", uuid())
      .send({
        client_id: TEST_CLIENT_ID,
        client_secret: TEST_CLIENT_SECRET,

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
        accountId: account.id,
        authenticated: true,
        authorization: {
          codeChallenge: "H4LnTn7e1DltMsohJgIeKSNgpvppJ1qP6QRRD9Ai1pw=",
          codeMethod: "sha256",
          email: account.email,
          id: uuid(),
          redirectUri: "https://redirect.uri/",
          responseType: ResponseType.REFRESH,
        },
        clientId: TEST_CLIENT_ID,
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
        client_id: TEST_CLIENT_ID,
        client_secret: TEST_CLIENT_SECRET,
      })
      .expect(202);

    await expect(TEST_SESSION_REPOSITORY.find({ id: session.id })).rejects.toStrictEqual(
      expect.any(RepositoryEntityNotFoundError),
    );
  });
});
