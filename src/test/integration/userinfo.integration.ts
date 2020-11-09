import MockDate from "mockdate";
import request from "supertest";
import { Account, Client } from "../../entity";
import { Audience, Permission, Scope } from "../../enum";
import { JWT_ACCESS_TOKEN_EXPIRY, JWT_ISSUER } from "../../config";
import { KeyPair, Keystore } from "@lindorm-io/key-pair";
import { MOCK_KEY_PAIR_OPTIONS } from "../mocks";
import { TokenIssuer } from "@lindorm-io/jwt";
import { accountInMemory, clientInMemory, keyPairInMemory } from "../../middleware";
import { encryptAccountPassword, encryptClientSecret } from "../../support";
import { koa } from "../../server/koa";
import { v4 as uuid } from "uuid";
import { winston } from "../../logger";

MockDate.set("2020-01-01 08:00:00.000");

describe("/user-info", () => {
  let account: Account;
  let accessToken: string;

  beforeAll(async () => {
    koa.load();

    const client = await clientInMemory.create(
      new Client({
        secret: await encryptClientSecret("secret"),
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

    const keyPair = await keyPairInMemory.create(new KeyPair(MOCK_KEY_PAIR_OPTIONS));

    const tokenIssuer = new TokenIssuer({
      issuer: JWT_ISSUER,
      logger: winston,
      keystore: new Keystore({ keys: [keyPair] }),
    });

    ({ token: accessToken } = tokenIssuer.sign({
      audience: Audience.ACCESS,
      clientId: client.id,
      expiry: JWT_ACCESS_TOKEN_EXPIRY,
      permission: account.permission,
      scope: [Scope.DEFAULT, Scope.OPENID].join(" "),
      subject: account.id,
    }));
  });

  test("GET /", async () => {
    const response = await request(koa.callback())
      .get(`/userinfo`)
      .set("Authorization", `Bearer ${accessToken}`)
      .set("X-Correlation-ID", uuid())
      .expect(200);

    expect(response.body).toStrictEqual({
      email: "test@lindorm.io",
      email_verified: true,
      sub: account.id,
      updated_at: 1577862000,
    });
  });
});
