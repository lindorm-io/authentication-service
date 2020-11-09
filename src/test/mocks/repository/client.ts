import { Client, IClientOptions } from "../../../entity";

export const MOCK_CLIENT_OPTIONS: IClientOptions = {
  approved: true,
  secret: "secret",
};

export const mockRepositoryClient = {
  create: jest.fn((entity: Client) => entity),
  update: jest.fn((entity: Client) => entity),
  find: jest.fn((filter: IClientOptions) => new Client({ ...MOCK_CLIENT_OPTIONS, ...filter })),
  findMany: jest.fn((filter: IClientOptions) => [new Client({ ...MOCK_CLIENT_OPTIONS, ...filter })]),
  remove: jest.fn((): any => undefined),
};
