import Joi from "@hapi/joi";
import { JOI_CODE_CHALLENGE, JOI_CODE_METHOD, JOI_EMAIL, JOI_EVENTS, JOI_GRANT_TYPE } from "../../constant";

export const schema = Joi.object({
  id: Joi.string().guid().required(),
  version: Joi.number().required(),
  created: Joi.date().required(),
  updated: Joi.date().required(),
  events: JOI_EVENTS,

  challengeId: Joi.string().guid().allow(null).required(),
  clientId: Joi.string().guid().required(),
  codeChallenge: JOI_CODE_CHALLENGE,
  codeMethod: JOI_CODE_METHOD,
  deviceId: Joi.string().guid().allow(null).required(),
  email: JOI_EMAIL,
  expires: Joi.date().required(),
  grantType: JOI_GRANT_TYPE,
  otpCode: Joi.string().allow(null).required(),
  redirectUri: Joi.string().uri().required(),
  responseType: Joi.string().required(),
  scope: Joi.array().required(),
});
