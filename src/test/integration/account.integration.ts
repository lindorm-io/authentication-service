import MockDate from "mockdate";
import request from "supertest";
import { Account, Client } from "../../entity";
import { Audience, Permission, Scope } from "../../enum";
import { CryptoAES } from "@lindorm-io/crypto";
import { JWT_ACCESS_TOKEN_EXPIRY, JWT_ISSUER, OTP_HANDLER_OPTIONS } from "../../config";
import { KeyPair, Keystore } from "@lindorm-io/key-pair";
import { MOCK_KEY_PAIR_OPTIONS } from "../mocks";
import { RepositoryEntityNotFoundError } from "@lindorm-io/mongo";
import { TokenIssuer } from "@lindorm-io/jwt";
import { accountInMemory, clientInMemory, keyPairInMemory } from "../../middleware";
import { authenticator } from "otplib";
import { baseParse } from "@lindorm-io/core";
import { encryptAccountPassword, encryptClientSecret, generateAccountOTP } from "../../support";
import { koa } from "../../server/koa";
import { v4 as uuid } from "uuid";
import { winston } from "../../logger";

MockDate.set("2020-01-01 08:00:00.000");

describe("/account", () => {
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

  test("POST /", async () => {
    const response = await request(koa.callback())
      .post("/account/")
      .set("Authorization", `Bearer ${accessToken}`)
      .set("X-Correlation-ID", uuid())
      .send({
        email: "create@lindorm.io",
        permission: Permission.USER,
      })
      .expect(201);

    expect(response.body).toStrictEqual({
      account_id: expect.any(String),
    });

    await expect(accountInMemory.find({ id: response.body.account_id })).resolves.toStrictEqual(
      expect.objectContaining({
        id: response.body.account_id,
      }),
    );
  });

  test("GET /:id", async () => {
    const response = await request(koa.callback())
      .get(`/account/${account.id}`)
      .set("Authorization", `Bearer ${accessToken}`)
      .set("X-Correlation-ID", uuid())
      .expect(200);

    expect(response.body).toStrictEqual({
      created: "2020-01-01T07:00:00.000Z",
      devices: [],
      email: "test@lindorm.io",
      has_otp: false,
      has_password: true,
      permission: Permission.ADMIN,
      sessions: [],
      updated: "2020-01-01T07:00:00.000Z",
    });
  });

  test("DELETE /:id", async () => {
    const tmp = await accountInMemory.create(
      new Account({
        email: "remove@email.com",
      }),
    );

    await request(koa.callback())
      .delete(`/account/${tmp.id}`)
      .set("Authorization", `Bearer ${accessToken}`)
      .set("X-Correlation-ID", uuid())
      .expect(204);

    await expect(accountInMemory.find({ id: tmp.id })).rejects.toStrictEqual(expect.any(RepositoryEntityNotFoundError));
  });

  test("DELETE /:id/otp", async () => {
    const tmp = await accountInMemory.create(
      new Account({
        email: "otp@email.com",
        otp: generateAccountOTP(),
      }),
    );
    const aes = new CryptoAES({
      secret: OTP_HANDLER_OPTIONS.secret,
    });
    const bindingCode = authenticator.generate(aes.decrypt(baseParse(tmp.otp.signature)));

    await request(koa.callback())
      .delete(`/account/${tmp.id}/otp`)
      .set("Authorization", `Bearer ${accessToken}`)
      .set("X-Correlation-ID", uuid())
      .send({
        binding_code: bindingCode,
      })
      .expect(204);

    await expect(accountInMemory.find({ id: tmp.id })).resolves.toStrictEqual(
      expect.objectContaining({
        otp: { signature: null, uri: null },
      }),
    );
  });

  test("PATCH /:id/permission", async () => {
    const tmp = await accountInMemory.create(
      new Account({
        email: "update@email.com",
      }),
    );

    await request(koa.callback())
      .patch(`/account/${tmp.id}/permission`)
      .set("Authorization", `Bearer ${accessToken}`)
      .set("X-Correlation-ID", uuid())
      .send({
        permission: Permission.LOCKED,
      })
      .expect(204);

    await expect(accountInMemory.find({ id: tmp.id })).resolves.toStrictEqual(
      expect.objectContaining({
        permission: Permission.LOCKED,
      }),
    );
  });

  test("PATCH /email", async () => {
    await request(koa.callback())
      .patch("/account/email")
      .set("Authorization", `Bearer ${accessToken}`)
      .set("X-Correlation-ID", uuid())
      .send({
        updatedEmail: "new@lindorm.io",
      })
      .expect(204);

    await expect(accountInMemory.find({ id: account.id })).resolves.toStrictEqual(
      expect.objectContaining({
        email: "new@lindorm.io",
      }),
    );
  });

  test("POST /otp", async () => {
    const response = await request(koa.callback())
      .post("/account/otp")
      .set("Authorization", `Bearer ${accessToken}`)
      .set("X-Correlation-ID", uuid())
      .expect(200);

    expect(response.body).toStrictEqual({
      uri: expect.any(String),
    });

    await expect(accountInMemory.find({ id: account.id })).resolves.toStrictEqual(
      expect.objectContaining({
        otp: {
          signature: expect.any(String),
          uri: response.body.uri,
        },
      }),
    );
  });

  test("PUT /password", async () => {
    const oldSignature = account.password.signature;

    await request(koa.callback())
      .put("/account/password")
      .set("Authorization", `Bearer ${accessToken}`)
      .set("X-Correlation-ID", uuid())
      .send({
        password: "password",
        updatedPassword: "new-password",
      })
      .expect(204);

    const result = await accountInMemory.find({ id: account.id });

    expect(result.password.signature).not.toBe(oldSignature);
  });
});
