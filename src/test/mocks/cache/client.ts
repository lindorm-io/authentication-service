import { Client } from "@lindorm-io/koa-client";
import { MOCK_CLIENT_OPTIONS } from "../repository";

export const mockCacheClient = {
  create: jest.fn((entity: Client) => entity),
  update: jest.fn((entity: Client) => entity),
  find: jest.fn((id: string) => new Client({ ...MOCK_CLIENT_OPTIONS, id })),
  findAll: jest.fn(() => [new Client(MOCK_CLIENT_OPTIONS)]),
  remove: jest.fn((): any => undefined),
};
