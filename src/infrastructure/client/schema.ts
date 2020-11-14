import Joi from "@hapi/joi";
import { JOI_EVENTS } from "../../constant";

export const schema = Joi.object({
  id: Joi.string().guid().required(),
  version: Joi.number().required(),
  created: Joi.date().required(),
  updated: Joi.date().required(),
  events: JOI_EVENTS,

  approved: Joi.boolean().required(),
  description: Joi.string().allow(null).required(),
  emailAuthorizationUri: Joi.string().uri().allow(null).required(),
  name: Joi.string().allow(null).required(),
  secret: Joi.string().base64().allow(null).required(),
});
