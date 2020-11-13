import MockDate from "mockdate";
import request from "supertest";
import { generateECCKeys, generateRSAKeys, KeyPair } from "@lindorm-io/key-pair";
import { koa } from "../../server/koa";
import { v4 as uuid } from "uuid";
import { TEST_KEY_PAIR_REPOSITORY, loadMongoConnection } from "../connection/mongo-connection";

MockDate.set("2020-01-01 08:00:00.000");

describe("/.well-known", () => {
  let rsaKeyPair: KeyPair;
  let ecKeyPair: KeyPair;

  beforeAll(async () => {
    await loadMongoConnection();

    koa.load();

    rsaKeyPair = await TEST_KEY_PAIR_REPOSITORY.create(new KeyPair(await generateRSAKeys()));
    ecKeyPair = await TEST_KEY_PAIR_REPOSITORY.create(new KeyPair(await generateECCKeys()));
  });

  test("GET /openid-configuration", async () => {
    const response = await request(koa.callback())
      .get(`/.well-known/openid-configuration`)
      .set("X-Correlation-ID", uuid())
      .expect(200);

    expect(response.body).toStrictEqual({
      authorization_endpoint: "http://localhost/oauth/authorization",
      claims_parameter_supported: false,
      grant_types_supported: ["pin_code", "biometrics", "email_link", "mfa-otp", "password", "refresh_token"],
      id_token_encryption_alg_values_supported: [],
      id_token_encryption_enc_values_supported: [],
      id_token_signing_alg_values_supported: ["ES512", "RS512"],
      issuer: "https://test.lindorm.io/",
      jwks_uri: "http://localhost/.well-known/jwks",
      request_parameter_supported: false,
      request_uri_parameter_supported: false,
      response_types_supported: ["token", "id_token", "code"],
      scopes_supported: ["default"],
      subject_types_supported: [],
      token_endpoint: "http://localhost/oauth/token",
      token_endpoint_auth_methods_supported: ["biometrics", "email", "pin", "pwd", "token"],
      token_endpoint_auth_signing_alg_values_supported: ["ES512", "RS512"],
      userinfo_endpoint: "http://localhost/userinfo",
    });
  });

  test("GET /jwks", async () => {
    const response = await request(koa.callback()).get(`/.well-known/jwks`).set("X-Correlation-ID", uuid()).expect(200);

    expect(response.body).toStrictEqual({
      keys: [
        {
          alg: "ES512",
          c: 1577862000,
          e: "AQAB",
          exp: null,
          kid: expect.any(String),
          kty: "ec",
          n: expect.any(String),
          use: "sig",
        },
        {
          alg: rsaKeyPair.algorithm,
          c: 1577862000,
          e: "AQAB",
          exp: null,
          kid: rsaKeyPair.id,
          kty: rsaKeyPair.type,
          n: rsaKeyPair.publicKey,
          use: "sig",
        },
        {
          alg: ecKeyPair.algorithm,
          c: 1577862000,
          e: "AQAB",
          exp: null,
          kid: ecKeyPair.id,
          kty: ecKeyPair.type,
          n: ecKeyPair.publicKey,
          use: "sig",
        },
      ],
    });
  });
});
