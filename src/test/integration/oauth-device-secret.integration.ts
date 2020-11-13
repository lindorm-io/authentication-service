import MockDate from "mockdate";
import request from "supertest";
import { Account, Device } from "../../entity";
import { GrantType, ResponseType } from "../../enum";
import { MOCK_CODE_VERIFIER } from "../mocks";
import { encryptDeviceSecret } from "../../support";
import { generateRSAKeys, KeyPairHandler } from "@lindorm-io/key-pair";
import { getRandomValue } from "@lindorm-io/core";
import { koa } from "../../server/koa";
import { v4 as uuid } from "uuid";
import {
  TEST_ACCOUNT_REPOSITORY,
  TEST_CLIENT_ID,
  TEST_CLIENT_SECRET,
  TEST_DEVICE_REPOSITORY,
  loadMongoConnection,
} from "../connection/mongo-connection";

MockDate.set("2020-01-01 08:00:00.000");

describe("/oauth DEVICE_SECRET", () => {
  const deviceSecret = getRandomValue(32);

  let handler: KeyPairHandler;
  let device: Device;

  beforeAll(async () => {
    await loadMongoConnection();

    koa.load();

    const { algorithm, privateKey, publicKey } = await generateRSAKeys("");

    handler = new KeyPairHandler({
      algorithm,
      privateKey,
      publicKey,
    });

    const account = await TEST_ACCOUNT_REPOSITORY.create(new Account({ email: "test@lindorm.io" }));

    device = await TEST_DEVICE_REPOSITORY.create(
      new Device({
        accountId: account.id,
        secret: await encryptDeviceSecret(deviceSecret),
        publicKey,
      }),
    );
  });

  test("should resolve", async () => {
    const initResponse = await request(koa.callback())
      .post("/oauth/authorization")
      .set("X-Correlation-ID", uuid())
      .send({
        client_id: TEST_CLIENT_ID,
        client_secret: TEST_CLIENT_SECRET,

        device_id: device.id,

        code_challenge: "H4LnTn7e1DltMsohJgIeKSNgpvppJ1qP6QRRD9Ai1pw=",
        code_method: "sha256",
        grant_type: GrantType.DEVICE_SECRET,
        redirect_uri: "https://redirect.uri/",
        response_type: [ResponseType.REFRESH, ResponseType.ACCESS].join(" "),
        scope: "default",
        state: "MsohJgIeKSNgpvpp",
        subject: "test@lindorm.io",
      })
      .expect(200);

    expect(initResponse.body).toStrictEqual({
      device_challenge: expect.any(String),
      expires: 1577864700,
      expires_in: 2700,
      redirect_uri: "https://redirect.uri/",
      state: "MsohJgIeKSNgpvpp",
      token: expect.any(String),
    });

    const {
      body: { device_challenge: deviceChallenge, token },
    } = initResponse;

    const deviceVerifier = handler.sign(deviceChallenge);

    const tokenResponse = await request(koa.callback())
      .post("/oauth/token")
      .set("X-Correlation-ID", uuid())
      .send({
        client_id: TEST_CLIENT_ID,
        client_secret: TEST_CLIENT_SECRET,

        authorization_token: token,

        device_id: device.id,

        code_verifier: MOCK_CODE_VERIFIER,
        device_verifier: deviceVerifier,
        grant_type: GrantType.DEVICE_SECRET,
        secret: deviceSecret,
        subject: "test@lindorm.io",
      })
      .expect(200);

    expect(tokenResponse.body).toStrictEqual({
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
  });
});
