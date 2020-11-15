import MockDate from "mockdate";
import request from "supertest";
import { Account } from "../../entity";
import { Audience } from "../../enum";
import { Permission, Scope } from "@lindorm-io/jwt";
import { CryptoAES } from "@lindorm-io/crypto";
import { JWT_ACCESS_TOKEN_EXPIRY, OTP_HANDLER_OPTIONS } from "../../config";
import { RepositoryEntityNotFoundError } from "@lindorm-io/mongo";
import { authenticator } from "otplib";
import { baseParse } from "@lindorm-io/core";
import { generateAccountOTP } from "../../support/account";
import { koa } from "../../server/koa";
import { v4 as uuid } from "uuid";
import {
  TEST_ACCOUNT,
  TEST_ACCOUNT_REPOSITORY,
  TEST_CLIENT,
  TEST_TOKEN_ISSUER,
  loadMongoConnection,
  loadRedisConnection,
} from "../grey-box";

MockDate.set("2020-01-01 08:00:00.000");

describe("/account", () => {
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

    await expect(TEST_ACCOUNT_REPOSITORY.find({ id: response.body.account_id })).resolves.toStrictEqual(
      expect.objectContaining({
        id: response.body.account_id,
      }),
    );
  });

  test("GET /:id", async () => {
    const response = await request(koa.callback())
      .get(`/account/${TEST_ACCOUNT.id}`)
      .set("Authorization", `Bearer ${accessToken}`)
      .set("X-Correlation-ID", uuid())
      .expect(200);

    expect(response.body).toStrictEqual({
      created: "2020-01-01T07:00:00.000Z",
      devices: [],
      email: TEST_ACCOUNT.email,
      has_otp: false,
      has_password: false,
      permission: Permission.ADMIN,
      sessions: [],
      updated: "2020-01-01T07:00:00.000Z",
    });
  });

  test("DELETE /:id", async () => {
    const tmp = await TEST_ACCOUNT_REPOSITORY.create(
      new Account({
        email: "remove@email.com",
      }),
    );

    await request(koa.callback())
      .delete(`/account/${tmp.id}`)
      .set("Authorization", `Bearer ${accessToken}`)
      .set("X-Correlation-ID", uuid())
      .expect(204);

    await expect(TEST_ACCOUNT_REPOSITORY.find({ id: tmp.id })).rejects.toStrictEqual(
      expect.any(RepositoryEntityNotFoundError),
    );
  });

  test("DELETE /:id/otp", async () => {
    const tmp = await TEST_ACCOUNT_REPOSITORY.create(
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

    await expect(TEST_ACCOUNT_REPOSITORY.find({ id: tmp.id })).resolves.toStrictEqual(
      expect.objectContaining({
        otp: { signature: null, uri: null },
      }),
    );
  });

  test("PATCH /:id/permission", async () => {
    const tmp = await TEST_ACCOUNT_REPOSITORY.create(
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

    await expect(TEST_ACCOUNT_REPOSITORY.find({ id: tmp.id })).resolves.toStrictEqual(
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

    await expect(TEST_ACCOUNT_REPOSITORY.find({ id: TEST_ACCOUNT.id })).resolves.toStrictEqual(
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

    await expect(TEST_ACCOUNT_REPOSITORY.find({ id: TEST_ACCOUNT.id })).resolves.toStrictEqual(
      expect.objectContaining({
        otp: {
          signature: expect.any(String),
          uri: response.body.uri,
        },
      }),
    );
  });

  test("PUT /password", async () => {
    const oldSignature = TEST_ACCOUNT.account.password.signature;

    await request(koa.callback())
      .put("/account/password")
      .set("Authorization", `Bearer ${accessToken}`)
      .set("X-Correlation-ID", uuid())
      .send({
        password: "password",
        updatedPassword: "new-password",
      })
      .expect(204);

    const result = await TEST_ACCOUNT_REPOSITORY.find({ id: TEST_ACCOUNT.id });

    expect(result.password.signature).not.toBe(oldSignature);
  });
});
