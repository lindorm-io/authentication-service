import Joi from "@hapi/joi";
import { GrantType, MultiFactorChallengeType } from "../enum";
import { Permission } from "@lindorm-io/jwt";

export const JOI_CHALLENGE_TYPE = Joi.string()
  .case("lower")
  .valid(MultiFactorChallengeType.OOB, MultiFactorChallengeType.OTP)
  .required();

export const JOI_CODE_CHALLENGE = Joi.string().min(32).max(1024).required();

export const JOI_CODE_METHOD = Joi.string().valid("sha1", "sha224", "sha256", "sha384", "sha512").required();

export const JOI_EMAIL = Joi.string()
  .case("lower")
  .email({
    minDomainSegments: 2,
    tlds: { deny: [] },
  })
  .required();

export const JOI_EVENTS = Joi.array()
  .items(
    Joi.object({
      date: Joi.date().required(),
      name: Joi.string().required(),
      payload: Joi.object().required(),
    }),
  )
  .required();

export const JOI_GRANT_TYPE = Joi.string()
  .valid(
    // GrantType.AUTHORIZATION_CODE,
    // GrantType.CLIENT_CREDENTIALS,
    // GrantType.IMPLICIT,
    // GrantType.MULTI_FACTOR_OOB,
    GrantType.DEVICE_PIN,
    GrantType.DEVICE_SECRET,
    GrantType.EMAIL_LINK,
    GrantType.EMAIL_OTP,
    GrantType.MULTI_FACTOR_OTP,
    GrantType.PASSWORD,
    GrantType.REFRESH_TOKEN,
  )
  .required();

export const JOI_PERMISSION = Joi.string().valid(Permission.ADMIN, Permission.USER, Permission.LOCKED).required();

export const JOI_STATE = Joi.string().min(16).base64().required();

export const JOI_JWT_TOKEN = Joi.string()
  .pattern(/^[A-Za-z0-9-_=]+\.[A-Za-z0-9-_=]+\.?[A-Za-z0-9-_.+/=]*$/)
  .required();
