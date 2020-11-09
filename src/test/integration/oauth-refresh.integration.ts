import MockDate from "mockdate";
import request from "supertest";
import { Account, Client, Session } from "../../entity";
import { Audience, GrantType, Permission, ResponseType, Scope } from "../../enum";
import { JWT_ISSUER } from "../../config";
import { KeyPair, Keystore } from "@lindorm-io/key-pair";
import { MOCK_KEY_PAIR_OPTIONS } from "../mocks";
import { TokenIssuer } from "@lindorm-io/jwt";
import { accountInMemory, clientInMemory, keyPairInMemory, sessionInMemory } from "../../middleware";
import { encryptAccountPassword, encryptClientSecret } from "../../support";
import { getRandomValue } from "@lindorm-io/core";
import { koa } from "../../server/koa";
import { v4 as uuid } from "uuid";
import { winston } from "../../logger";

MockDate.set("2020-01-01 08:00:00.000");

describe("/oauth REFRESH_TOKEN", () => {
  const clientId = uuid();
  const clientSecret = getRandomValue(16);

  let account: Account;
  let client: Client;
  let session: Session;
  let tokenIssuer: TokenIssuer;
  let refreshToken: string;

  beforeAll(async () => {
    koa.load();

    client = await clientInMemory.create(
      new Client({
        id: clientId,
        secret: await encryptClientSecret(clientSecret),
        approved: true,
        emailAuthorizationUri: "https://lindorm.io/",
      }),
    );

    account = await accountInMemory.create(
      new Account({
        email: "test@lindorm.io",
        password: { signature: await encryptAccountPassword("password"), updated: new Date() },
        permission: Permission.ADMIN,
      }),
    );

    session = await sessionInMemory.create(
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
        clientId: client.id,
        expires: new Date("2099-01-01"),
        grantType: GrantType.EMAIL_OTP,
        refreshId: uuid(),
        scope: Scope.DEFAULT,
      }),
    );

    const keyPair = await keyPairInMemory.create(new KeyPair(MOCK_KEY_PAIR_OPTIONS));

    tokenIssuer = new TokenIssuer({
      issuer: JWT_ISSUER,
      logger: winston,
      keystore: new Keystore({ keys: [keyPair] }),
    });

    ({ token: refreshToken } = tokenIssuer.sign({
      audience: Audience.REFRESH,
      authMethodsReference: "email",
      clientId: client.id,
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
        client_id: clientId,
        client_secret: clientSecret,

        refresh_token: refreshToken,

        grant_type: GrantType.REFRESH_TOKEN,
        response_type: [ResponseType.REFRESH, ResponseType.ACCESS].join(" "),
      })
      .expect(200);

    expect(response.body).toStrictEqual({
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

    await expect(sessionInMemory.find({ id: session.id })).resolves.toStrictEqual(
      expect.objectContaining({
        refreshId: response.body.refresh_token.id,
      }),
    );
  });
});
