import MockDate from "mockdate";
import request from "supertest";
import { Account, Session } from "../../entity";
import { GrantType, ResponseType } from "../../enum";
import { koa } from "../../server/koa";
import { v4 as uuid } from "uuid";
import {
  TEST_ACCOUNT_REPOSITORY,
  TEST_CLIENT,
  TEST_SESSION_REPOSITORY,
  generateTestOauthData,
  getTestAccount,
  generateRefreshToken,
  getTestSession,
  setupIntegration,
} from "../grey-box";

jest.mock("../../axios", () => ({
  getOpenIdClaims: jest.fn(() => ({ claim: "claim" })),
}));

MockDate.set("2020-01-01 08:00:00.000");

describe("/oauth REFRESH_TOKEN", () => {
  let account: Account;
  let session: Session;
  let refreshToken: string;

  const { codeMethod, codeChallenge } = generateTestOauthData();

  beforeAll(async () => {
    await setupIntegration();
    koa.load();
  });

  beforeEach(async () => {
    account = await TEST_ACCOUNT_REPOSITORY.create(getTestAccount("test@lindorm.io"));
    session = await TEST_SESSION_REPOSITORY.create(getTestSession(account, TEST_CLIENT, codeChallenge, codeMethod));
    refreshToken = generateRefreshToken(account, session);
  });

  test("should resolve", async () => {
    const response = await request(koa.callback())
      .post("/oauth/token")
      .set("X-Client-ID", TEST_CLIENT.id)
      .set("X-Correlation-ID", uuid())
      .send({
        client_id: TEST_CLIENT.id,
        client_secret: "test_client_secret",

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
