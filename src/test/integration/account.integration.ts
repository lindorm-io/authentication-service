import MockDate from "mockdate";
import request from "supertest";
import { Account } from "../../entity";
import { RepositoryEntityNotFoundError } from "@lindorm-io/mongo";
import { koa } from "../../server/koa";
import { v4 as uuid } from "uuid";
import {
  TEST_ACCOUNT_REPOSITORY,
  TEST_CLIENT,
  generateTestAccountOTP,
  generateAccessToken,
  getTestAccount,
  getTestAccountAdmin,
  getTestAccountWithOTP,
  setupIntegration,
} from "../grey-box";

jest.mock("../../axios", () => ({
  ensureIdentity: jest.fn(() => ({})),
}));

MockDate.set("2020-01-01 08:00:00.000");

describe("/account", () => {
  beforeAll(async () => {
    await setupIntegration();
    koa.load();
  });

  describe("ADMIN", () => {
    let account: Account;
    let accessToken: string;

    beforeEach(async () => {
      account = await TEST_ACCOUNT_REPOSITORY.create(getTestAccountAdmin("admin@lindorm.io"));
      accessToken = generateAccessToken(account);
    });

    test("POST /", async () => {
      const response = await request(koa.callback())
        .post("/account/")
        .set("Authorization", `Bearer ${accessToken}`)
        .set("X-Client-ID", TEST_CLIENT.id)
        .set("X-Correlation-ID", uuid())
        .send({
          email: "create@lindorm.io",
          permission: "user",
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

    test("DELETE /:id", async () => {
      const tmp = await TEST_ACCOUNT_REPOSITORY.create(
        new Account({
          email: "remove@email.com",
        }),
      );

      await request(koa.callback())
        .delete(`/account/${tmp.id}`)
        .set("Authorization", `Bearer ${accessToken}`)
        .set("X-Client-ID", TEST_CLIENT.id)
        .set("X-Correlation-ID", uuid())
        .expect(204);

      await expect(TEST_ACCOUNT_REPOSITORY.find({ id: tmp.id })).rejects.toStrictEqual(
        expect.any(RepositoryEntityNotFoundError),
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
        .set("X-Client-ID", TEST_CLIENT.id)
        .set("X-Correlation-ID", uuid())
        .send({
          permission: "locked",
        })
        .expect(204);

      await expect(TEST_ACCOUNT_REPOSITORY.find({ id: tmp.id })).resolves.toStrictEqual(
        expect.objectContaining({
          permission: "locked",
        }),
      );
    });
  });

  describe("USER", () => {
    let account: Account;
    let accessToken: string;

    beforeEach(async () => {
      account = await TEST_ACCOUNT_REPOSITORY.create(getTestAccount("test@lindorm.io"));
      accessToken = generateAccessToken(account);
    });

    test("GET /:id", async () => {
      const response = await request(koa.callback())
        .get(`/account/${account.id}`)
        .set("Authorization", `Bearer ${accessToken}`)
        .set("X-Client-ID", TEST_CLIENT.id)
        .set("X-Correlation-ID", uuid())
        .expect(200);

      expect(response.body).toStrictEqual({
        created: "2020-01-01T07:00:00.000Z",
        email: account.email,
        has_otp: false,
        has_password: false,
        permission: "user",
        sessions: [],
        updated: "2020-01-01T07:00:00.000Z",
      });
    });

    test("DELETE /:id/otp", async () => {
      const { otp, bindingCode } = generateTestAccountOTP();

      account = await TEST_ACCOUNT_REPOSITORY.create(await getTestAccountWithOTP("test@lindorm.io", otp));
      accessToken = generateAccessToken(account);

      await request(koa.callback())
        .delete(`/account/${account.id}/otp`)
        .set("Authorization", `Bearer ${accessToken}`)
        .set("X-Client-ID", TEST_CLIENT.id)
        .set("X-Correlation-ID", uuid())
        .send({
          binding_code: bindingCode,
        })
        .expect(204);

      await expect(TEST_ACCOUNT_REPOSITORY.find({ id: account.id })).resolves.toStrictEqual(
        expect.objectContaining({
          otp: { signature: null, uri: null },
        }),
      );
    });

    test("PATCH /email", async () => {
      await request(koa.callback())
        .patch("/account/email")
        .set("Authorization", `Bearer ${accessToken}`)
        .set("X-Client-ID", TEST_CLIENT.id)
        .set("X-Correlation-ID", uuid())
        .send({
          updatedEmail: "new@lindorm.io",
        })
        .expect(204);

      await expect(TEST_ACCOUNT_REPOSITORY.find({ id: account.id })).resolves.toStrictEqual(
        expect.objectContaining({
          email: "new@lindorm.io",
        }),
      );
    });

    test("POST /otp", async () => {
      const response = await request(koa.callback())
        .post("/account/otp")
        .set("Authorization", `Bearer ${accessToken}`)
        .set("X-Client-ID", TEST_CLIENT.id)
        .set("X-Correlation-ID", uuid())
        .expect(200);

      expect(response.body).toStrictEqual({
        uri: expect.any(String),
      });

      await expect(TEST_ACCOUNT_REPOSITORY.find({ id: account.id })).resolves.toStrictEqual(
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
        .set("X-Client-ID", TEST_CLIENT.id)
        .set("X-Correlation-ID", uuid())
        .send({
          password: "password",
          updatedPassword: "new-password",
        })
        .expect(204);

      const result = await TEST_ACCOUNT_REPOSITORY.find({ id: account.id });

      expect(result.password.signature).not.toBe(oldSignature);
    });
  });
});
