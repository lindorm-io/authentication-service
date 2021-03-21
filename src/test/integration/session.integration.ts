import MockDate from "mockdate";
import request from "supertest";
import { RepositoryEntityNotFoundError } from "@lindorm-io/mongo";
import { Account, Session } from "../../entity";
import { koa } from "../../server/koa";
import { v4 as uuid } from "uuid";
import {
  TEST_ACCOUNT_REPOSITORY,
  TEST_CLIENT,
  TEST_SESSION_REPOSITORY,
  generateTestOauthData,
  getGreyBoxAccessToken,
  getTestAccount,
  getGreyBoxRefreshToken,
  getTestSession,
  setupIntegration,
} from "../grey-box";

MockDate.set("2020-01-01 08:00:00.000");

describe("/session", () => {
  let account: Account;
  let session: Session;
  let accessToken: string;
  let refreshToken: string;

  const { codeMethod, codeChallenge } = generateTestOauthData();

  beforeAll(async () => {
    await setupIntegration();
    koa.load();
  });

  beforeEach(async () => {
    account = await TEST_ACCOUNT_REPOSITORY.create(getTestAccount("test@lindorm.io"));
    session = await TEST_SESSION_REPOSITORY.create(getTestSession(account, TEST_CLIENT, codeChallenge, codeMethod));
    accessToken = getGreyBoxAccessToken(account);
    refreshToken = getGreyBoxRefreshToken(account, session);
  });

  test("POST /logout", async () => {
    await request(koa.callback())
      .post("/session/logout/")
      .set("Authorization", `Bearer ${accessToken}`)
      .set("X-Client-ID", TEST_CLIENT.id)
      .set("X-Correlation-ID", uuid())
      .send({
        client_id: TEST_CLIENT.id,
        client_secret: "test_client_secret",

        refresh_token: refreshToken,
      })
      .expect(202);

    await expect(TEST_SESSION_REPOSITORY.find({ id: session.id })).rejects.toStrictEqual(
      expect.any(RepositoryEntityNotFoundError),
    );
  });

  test("DELETE /:id", async () => {
    await request(koa.callback())
      .delete(`/session/${session.id}`)
      .set("Authorization", `Bearer ${accessToken}`)
      .set("X-Client-ID", TEST_CLIENT.id)
      .set("X-Correlation-ID", uuid())
      .send({
        client_id: TEST_CLIENT.id,
        client_secret: "test_client_secret",
      })
      .expect(202);

    await expect(TEST_SESSION_REPOSITORY.find({ id: session.id })).rejects.toStrictEqual(
      expect.any(RepositoryEntityNotFoundError),
    );
  });
});
