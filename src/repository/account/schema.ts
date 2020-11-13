import Joi from "@hapi/joi";
import { JOI_EMAIL, JOI_EVENTS, JOI_PERMISSION } from "../../constant";

export const schema = Joi.object({
  id: Joi.string().guid().required(),
  version: Joi.number().required(),
  created: Joi.date().required(),
  updated: Joi.date().required(),
  events: JOI_EVENTS,

  email: JOI_EMAIL,
  otp: Joi.object({
    signature: Joi.string().allow(null).required(),
    uri: Joi.string().allow(null).required(),
  }),
  password: Joi.object({
    signature: Joi.string().base64().allow(null).required(),
    updated: Joi.date().allow(null).required(),
  }),
  permission: JOI_PERMISSION,
});
