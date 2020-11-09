import MockDate from "mockdate";
import request from "supertest";
import { Account, Client, Device } from "../../entity";
import { GrantType, ResponseType } from "../../enum";
import { MOCK_CODE_VERIFIER, MOCK_KEY_PAIR_OPTIONS } from "../mocks";
import { accountInMemory, clientInMemory, deviceInMemory, keyPairInMemory } from "../../middleware";
import { encryptClientSecret, encryptDevicePIN } from "../../support";
import { generateRSAKeys, KeyPair, KeyPairHandler } from "@lindorm-io/key-pair";
import { getRandomValue } from "@lindorm-io/core";
import { koa } from "../../server/koa";
import { v4 as uuid } from "uuid";

MockDate.set("2020-01-01 08:00:00.000");

describe("/oauth DEVICE_PIN", () => {
  const clientId = uuid();
  const clientSecret = getRandomValue(16);

  let handler: KeyPairHandler;
  let device: Device;

  beforeAll(async () => {
    koa.load();

    await clientInMemory.create(
      new Client({
        id: clientId,
        secret: await encryptClientSecret(clientSecret),
        approved: true,
        emailAuthorizationUri: "https://lindorm.io/",
      }),
    );

    await keyPairInMemory.create(new KeyPair(MOCK_KEY_PAIR_OPTIONS));

    const { algorithm, privateKey, publicKey } = await generateRSAKeys("");

    handler = new KeyPairHandler({
      algorithm,
      privateKey,
      publicKey,
    });

    const account = await accountInMemory.create(new Account({ email: "test@lindorm.io" }));

    device = await deviceInMemory.create(
      new Device({
        accountId: account.id,
        pin: { signature: await encryptDevicePIN("123456"), updated: new Date() },
        publicKey,
      }),
    );
  });

  test("should resolve", async () => {
    const initResponse = await request(koa.callback())
      .post("/oauth/authorization")
      .set("X-Correlation-ID", uuid())
      .send({
        client_id: clientId,
        client_secret: clientSecret,

        device_id: device.id,

        code_challenge: "H4LnTn7e1DltMsohJgIeKSNgpvppJ1qP6QRRD9Ai1pw=",
        code_method: "sha256",
        grant_type: GrantType.DEVICE_PIN,
        redirect_uri: "https://redirect.uri/",
        response_type: [ResponseType.REFRESH, ResponseType.ACCESS].join(" "),
        scope: "default",
        state: "MsohJgIeKSNgpvpp",
        subject: "test@lindorm.io",
      })
      .expect(200);

    expect(initResponse.body).toStrictEqual({
      device_challenge: expect.any(String),
      expires: 1577862900,
      expires_in: 900,
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
        client_id: clientId,
        client_secret: clientSecret,

        authorization_token: token,

        device_id: device.id,

        code_verifier: MOCK_CODE_VERIFIER,
        device_verifier: deviceVerifier,
        grant_type: GrantType.DEVICE_PIN,
        pin: "123456",
        subject: "test@lindorm.io",
      })
      .expect(200);

    expect(tokenResponse.body).toStrictEqual({
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
  });

  test("should throw error when client is missing", async () => {
    const result = await request(koa.callback())
      .post("/oauth/authorization")
      .set("X-Correlation-ID", uuid())
      .send({
        // client_id: clientId,
        // client_secret: clientSecret,

        device_id: device.id,

        code_challenge: "H4LnTn7e1DltMsohJgIeKSNgpvppJ1qP6QRRD9Ai1pw=",
        code_method: "sha256",
        grant_type: GrantType.DEVICE_PIN,
        redirect_uri: "https://redirect.uri/",
        response_type: [ResponseType.REFRESH, ResponseType.ACCESS].join(" "),
        scope: "default",
        state: "MsohJgIeKSNgpvpp",
        subject: "test@lindorm.io",
      })
      .expect(500);

    expect(result.body).toStrictEqual({
      error: {
        details: [
          {
            context: {
              key: "clientId",
              label: "clientId",
            },
            message: '"clientId" is required',
            path: ["clientId"],
            type: "any.required",
          },
        ],
        message: '"clientId" is required',
      },
    });
  });

  test("should throw error when device is missing", async () => {
    const result = await request(koa.callback())
      .post("/oauth/authorization")
      .set("X-Correlation-ID", uuid())
      .send({
        client_id: clientId,
        client_secret: clientSecret,

        // device_id: device.id,

        code_challenge: "H4LnTn7e1DltMsohJgIeKSNgpvppJ1qP6QRRD9Ai1pw=",
        code_method: "sha256",
        grant_type: GrantType.DEVICE_PIN,
        redirect_uri: "https://redirect.uri/",
        response_type: [ResponseType.REFRESH, ResponseType.ACCESS].join(" "),
        scope: "default",
        state: "MsohJgIeKSNgpvpp",
        subject: "test@lindorm.io",
      })
      .expect(400);

    expect(result.body).toStrictEqual({
      error: {
        details: null,
        message: "Device not found",
        title: null,
      },
    });
  });
});
