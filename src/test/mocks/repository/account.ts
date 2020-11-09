import { Account, IAccountOptions } from "../../../entity";

export const MOCK_ACCOUNT_OPTIONS: IAccountOptions = {
  email: "email@lindorm.io",
};

export const mockRepositoryAccount = {
  create: jest.fn((entity: Account) => entity),
  update: jest.fn((entity: Account) => entity),
  find: jest.fn((filter: IAccountOptions) => new Account({ ...MOCK_ACCOUNT_OPTIONS, ...filter })),
  findMany: jest.fn((filter: IAccountOptions) => [new Account({ ...MOCK_ACCOUNT_OPTIONS, ...filter })]),
  remove: jest.fn((): any => undefined),
};
