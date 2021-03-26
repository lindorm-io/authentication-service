import Joi from "@hapi/joi";
import { JOI_CODE_CHALLENGE, JOI_CODE_METHOD, JOI_EMAIL, JOI_EVENTS, JOI_GRANT_TYPE } from "../../constant";

export const schema = Joi.object({
  id: Joi.string().guid().required(),
  version: Joi.number().required(),
  created: Joi.date().required(),
  updated: Joi.date().required(),
  events: JOI_EVENTS,

  accountId: Joi.string().guid().allow(null).required(),
  agent: Joi.object({
    browser: Joi.string().allow(null).required(),
    geoIp: Joi.object().allow(null).required(),
    os: Joi.string().allow(null).required(),
    platform: Joi.string().allow(null).required(),
    source: Joi.string().allow(null).required(),
    version: Joi.string().allow(null).required(),
  }),
  authenticated: Joi.boolean().required(),
  authorization: Joi.object({
    codeChallenge: JOI_CODE_CHALLENGE,
    codeMethod: JOI_CODE_METHOD,
    deviceChallenge: Joi.string().allow(null).required(),
    email: JOI_EMAIL,
    id: Joi.string().guid().required(),
    otpCode: Joi.string().allow(null).required(),
    redirectUri: Joi.string().uri().required(),
    responseType: Joi.string().required(),
  }),
  clientId: Joi.string().guid().required(),
  deviceId: Joi.string().guid().allow(null).required(),
  expires: Joi.date().required(),
  grantType: JOI_GRANT_TYPE,
  refreshId: Joi.string().guid().allow(null).required(),
  scope: Joi.array().required(),
});
