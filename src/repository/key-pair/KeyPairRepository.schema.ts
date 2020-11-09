import Joi from "@hapi/joi";
import { JOI_EVENTS } from "../../constant";

export const schema = Joi.object({
  id: Joi.string().guid().required(),
  version: Joi.number().required(),
  created: Joi.date().required(),
  updated: Joi.date().required(),
  events: JOI_EVENTS,

  algorithm: Joi.string().required(),
  expires: Joi.date().allow(null).required(),
  passphrase: Joi.string().allow(null).required(),
  privateKey: Joi.string().required(),
  publicKey: Joi.string().required(),
  type: Joi.string().required(),
});
