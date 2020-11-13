import MockDate from "mockdate";
import request from "supertest";
import { Account, Session } from "../../entity";
import { Audience, GrantType, Permission, ResponseType, Scope } from "../../enum";
import { JWT_ISSUER } from "../../config";
import { KeyPair, Keystore } from "@lindorm-io/key-pair";
import { MOCK_KEY_PAIR_OPTIONS } from "../mocks";
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

describe("/oauth REFRESH_TOKEN", () => {
  let account: Account;
  let session: Session;
  let tokenIssuer: TokenIssuer;
  let refreshToken: string;

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

    session = await TEST_SESSION_REPOSITORY.create(
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

    const keyPair = await TEST_KEY_PAIR_REPOSITORY.create(new KeyPair(MOCK_KEY_PAIR_OPTIONS));

    tokenIssuer = new TokenIssuer({
      issuer: JWT_ISSUER,
      logger: winston,
      keystore: new Keystore({ keys: [keyPair] }),
    });

    ({ token: refreshToken } = tokenIssuer.sign({
      audience: Audience.REFRESH,
      authMethodsReference: "email",
      clientId: TEST_CLIENT_ID,
      expiry: session.expires,
      id: session.refreshId,
      permission: account.permission,
      scope: Scope.DEFAULT,
      subject: session.id,
    }));
  });

  test("should resolve", async () => {
    const response = await request(koa.callback())
      .post("/oauth/token")
      .set("X-Correlation-ID", uuid())
      .send({
        client_id: TEST_CLIENT_ID,
        client_secret: TEST_CLIENT_SECRET,

        refresh_token: refreshToken,

        grant_type: GrantType.REFRESH_TOKEN,
        subject: account.email,
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
