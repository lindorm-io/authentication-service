import { MOCK_EC_PRIVATE_KEY, MOCK_EC_PUBLIC_KEY } from "../keys";
import { Algorithm, IKeyPairOptions, KeyPair, KeyType } from "@lindorm-io/key-pair";

export const MOCK_KEY_PAIR_OPTIONS: IKeyPairOptions = {
  algorithm: Algorithm.ES512,
  privateKey: MOCK_EC_PRIVATE_KEY,
  publicKey: MOCK_EC_PUBLIC_KEY,
  type: KeyType.EC,
};

export const mockRepositoryKeyPair = {
  create: jest.fn((entity: KeyPair) => entity),
  update: jest.fn((entity: KeyPair) => entity),
  find: jest.fn((filter: IKeyPairOptions) => new KeyPair({ ...MOCK_KEY_PAIR_OPTIONS, ...filter })),
  findMany: jest.fn((filter: IKeyPairOptions) => [new KeyPair({ ...MOCK_KEY_PAIR_OPTIONS, ...filter })]),
  findOrCreate: jest.fn((filter: IKeyPairOptions) => new KeyPair({ ...MOCK_KEY_PAIR_OPTIONS, ...filter })),
  remove: jest.fn((): any => undefined),
};
