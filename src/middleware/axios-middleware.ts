import { axiosMiddleware } from "@lindorm-io/koa-axios";
import { config } from "../config";

export const deviceAxiosMiddleware = axiosMiddleware({
  baseUrl: config.DEVICE_SERVICE_BASE_URL,
  basicAuth: {
    username: config.DEVICE_SERVICE_AUTH_USERNAME,
    password: config.DEVICE_SERVICE_AUTH_PASSWORD,
  },
  name: "device",
});

export const identityAxiosMiddleware = axiosMiddleware({
  baseUrl: config.IDENTITY_SERVICE_BASE_URL,
  basicAuth: {
    username: config.IDENTITY_SERVICE_AUTH_USERNAME,
    password: config.IDENTITY_SERVICE_AUTH_PASSWORD,
  },
  name: "identity",
});
