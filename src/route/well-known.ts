import { GrantType, ResponseType } from "../enum";
import { config } from "../config";
import { HttpStatus } from "@lindorm-io/core";
import { IKoaAuthContext } from "../typing";
import { Router } from "@lindorm-io/koa";
import { Scope } from "@lindorm-io/jwt";
import { getUnixTime } from "date-fns";

export const router = new Router();

router.get(
  "/openid-configuration",
  async (ctx: IKoaAuthContext): Promise<void> => {
    ctx.body = {
      issuer: config.JWT_ISSUER,
      authorization_endpoint: new URL("/oauth/authorize", config.HOST).toString(),
      token_endpoint: new URL("/oauth/token", config.HOST).toString(),
      userinfo_endpoint: new URL("/userinfo", config.HOST).toString(),
      jwks_uri: new URL("/.well-known/jwks.json", config.HOST).toString(),
      scopes_supported: [Scope.DEFAULT, Scope.EDIT, Scope.OPENID],
      response_types_supported: Object.values(ResponseType),
      token_endpoint_auth_methods_supported: ["biometrics", "email", "pin", "pwd", "token"],
      token_endpoint_auth_signing_alg_values_supported: ["ES512", "RS512"],
      grant_types_supported: [
        // GrantType.AUTHORIZATION_CODE,
        // GrantType.CLIENT_CREDENTIALS,
        // GrantType.IMPLICIT,
        // GrantType.MULTI_FACTOR_OOB,
        GrantType.DEVICE_PIN,
        GrantType.DEVICE_SECRET,
        GrantType.EMAIL_LINK,
        GrantType.MULTI_FACTOR_OTP,
        GrantType.PASSWORD,
        GrantType.REFRESH_TOKEN,
      ],
      subject_types_supported: [],
      id_token_signing_alg_values_supported: ["ES512", "RS512"],
      id_token_encryption_alg_values_supported: [],
      id_token_encryption_enc_values_supported: [],
      claims_parameter_supported: false,
      request_parameter_supported: false,
      request_uriParameter_supported: false,
    };
    ctx.status = HttpStatus.Success.OK;
  },
);

router.get(
  "/jwks.json",
  async (ctx: IKoaAuthContext): Promise<void> => {
    const usableKeys = ctx.keystore.auth.getUsableKeys();
    const keys: Array<any> = [];

    for (const key of usableKeys) {
      keys.push({
        alg: key.algorithm,
        c: getUnixTime(key.created),
        e: "AQAB",
        exp: key.expires,
        kid: key.id,
        kty: key.type,
        n: key.publicKey,
        use: "sig",
      });
    }

    ctx.body = { keys };
    ctx.status = HttpStatus.Success.OK;
  },
);
