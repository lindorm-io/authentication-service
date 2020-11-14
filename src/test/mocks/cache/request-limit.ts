import { IRequestLimitOptions, RequestLimit } from "../../../entity";
import { GrantType } from "../../../enum";

export const MOCK_REQUEST_LIMIT_OPTIONS: IRequestLimitOptions = {
  subject: "email@lindorm.io",
  grantType: GrantType.DEVICE_PIN,
};

export const mockCacheRequestLimit = {
  create: jest.fn((entity: RequestLimit) => entity),
  update: jest.fn((entity: RequestLimit) => entity),
  find: jest.fn((subject: string) => new RequestLimit({ ...MOCK_REQUEST_LIMIT_OPTIONS, subject })),
  findAll: jest.fn(() => [new RequestLimit(MOCK_REQUEST_LIMIT_OPTIONS)]),
  remove: jest.fn((): any => undefined),
};
