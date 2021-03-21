import MockDate from "mockdate";
import request from "supertest";
import { Account } from "../../entity";
import { koa } from "../../server/koa";
import { v4 as uuid } from "uuid";
import {
  TEST_ACCOUNT_REPOSITORY,
  TEST_CLIENT,
  getGreyBoxAccessToken,
  getTestAccount,
  setupIntegration,
} from "../grey-box";

MockDate.set("2020-01-01 08:00:00.000");

describe("/user-info", () => {
  let account: Account;
  let accessToken: string;

  beforeAll(async () => {
    await setupIntegration();
    koa.load();
  });

  beforeEach(async () => {
    account = await TEST_ACCOUNT_REPOSITORY.create(getTestAccount("test@lindorm.io"));
    accessToken = getGreyBoxAccessToken(account);
  });

  test("GET /", async () => {
    const response = await request(koa.callback())
      .get(`/userinfo`)
      .set("Authorization", `Bearer ${accessToken}`)
      .set("X-Client-ID", TEST_CLIENT.id)
      .set("X-Correlation-ID", uuid())
      .expect(200);

    expect(response.body).toStrictEqual({
      email: account.email,
      email_verified: true,
      sub: account.id,
      updated_at: 1577862000,
    });
  });
});
