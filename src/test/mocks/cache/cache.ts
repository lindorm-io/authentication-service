import { mockCacheKeyPair } from "./key-pair";
import { mockCacheRequestLimit } from "./request-limit";

export const getMockCache = (): any => ({
  keyPair: { ...mockCacheKeyPair },
  requestLimit: { ...mockCacheRequestLimit },
});
