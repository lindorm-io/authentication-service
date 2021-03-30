import { keyPairCacheMiddleware as _keyPairCacheMiddleware } from "@lindorm-io/koa-keystore";
import { AUTH_KEYSTORE_NAME } from "../constant";

export const keyPairCacheMiddleware = _keyPairCacheMiddleware({ keystoreName: AUTH_KEYSTORE_NAME });
