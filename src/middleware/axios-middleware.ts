import { axiosMiddleware } from "@lindorm-io/koa-axios";
import {
  DEVICE_SERVICE_BASE_URL,
  DEVICE_SERVICE_BASIC_AUTH,
  IDENTITY_SERVICE_BASE_URL,
  IDENTITY_SERVICE_BASIC_AUTH,
} from "../config";

export const deviceAxiosMiddleware = axiosMiddleware({
  baseUrl: DEVICE_SERVICE_BASE_URL,
  basicAuth: DEVICE_SERVICE_BASIC_AUTH,
  name: "device",
});

export const identityAxiosMiddleware = axiosMiddleware({
  baseUrl: IDENTITY_SERVICE_BASE_URL,
  basicAuth: IDENTITY_SERVICE_BASIC_AUTH,
  name: "identity",
});
