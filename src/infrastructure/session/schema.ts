import Joi from "@hapi/joi";
import { JOI_EVENTS, JOI_GRANT_TYPE } from "../../constant";

export const schema = Joi.object({
  id: Joi.string().guid().required(),
  version: Joi.number().required(),
  created: Joi.date().required(),
  updated: Joi.date().required(),
  events: JOI_EVENTS,

  accountId: Joi.string().guid().allow(null).required(),
  clientId: Joi.string().guid().required(),
  deviceId: Joi.string().guid().allow(null).required(),
  expires: Joi.date().required(),
  grantType: JOI_GRANT_TYPE,
  refreshId: Joi.string().guid().allow(null).required(),
  scope: Joi.array().required(),
});
