import { mockRepositoryAccount } from "./account";
import { mockRepositoryClient } from "./client";
import { mockRepositoryDevice } from "./device";
import { mockRepositoryKeyPair } from "./key-pair";
import { mockRepositorySession } from "./session";

export const getMockRepository = (): any => ({
  account: { ...mockRepositoryAccount },
  client: { ...mockRepositoryClient },
  device: { ...mockRepositoryDevice },
  keyPair: { ...mockRepositoryKeyPair },
  session: { ...mockRepositorySession },
});
