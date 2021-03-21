import { mockRepositoryAccount } from "./account";
import { mockRepositoryKeyPair } from "./key-pair";
import { mockRepositorySession } from "./session";

export const getMockRepository = (): any => ({
  account: { ...mockRepositoryAccount },
  keyPair: { ...mockRepositoryKeyPair },
  session: { ...mockRepositorySession },
});
