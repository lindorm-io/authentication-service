import Joi from "@hapi/joi";
import { JOI_EMAIL, JOI_EVENTS, JOI_GRANT_TYPE } from "../../constant";

export const schema = Joi.object({
  id: Joi.string().guid().required(),
  version: Joi.number().required(),
  created: Joi.date().required(),
  updated: Joi.date().required(),
  events: JOI_EVENTS,

  backOffUntil: Joi.date().allow(null).required(),
  failedTries: Joi.number().required(),
  grantType: JOI_GRANT_TYPE,
  subject: JOI_EMAIL,
});
