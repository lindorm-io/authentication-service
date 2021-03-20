import { mockRepositoryAccount } from "./account";
import { mockRepositoryClient } from "./client";
import { mockRepositoryKeyPair } from "./key-pair";
import { mockRepositorySession } from "./session";

export const getMockRepository = (): any => ({
  account: { ...mockRepositoryAccount },
  client: { ...mockRepositoryClient },
  keyPair: { ...mockRepositoryKeyPair },
  session: { ...mockRepositorySession },
});
