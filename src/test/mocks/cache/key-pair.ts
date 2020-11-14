import { MOCK_KEY_PAIR_OPTIONS } from "../repository";
import { KeyPair } from "@lindorm-io/key-pair";

export const mockCacheKeyPair = {
  create: jest.fn((entity: KeyPair) => entity),
  update: jest.fn((entity: KeyPair) => entity),
  find: jest.fn((id: string) => new KeyPair({ ...MOCK_KEY_PAIR_OPTIONS, id })),
  findAll: jest.fn(() => [new KeyPair(MOCK_KEY_PAIR_OPTIONS)]),
  remove: jest.fn((): any => undefined),
};
