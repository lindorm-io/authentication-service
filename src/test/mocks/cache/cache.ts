import { mockCacheClient } from "./client";
import { mockCacheKeyPair } from "./key-pair";
import { mockCacheRequestLimit } from "./request-limit";

export const getMockCache = () => ({
  client: { ...mockCacheClient },
  keyPair: { ...mockCacheKeyPair },
  requestLimit: { ...mockCacheRequestLimit },
});
