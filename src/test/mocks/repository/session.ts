import { MOCK_CODE_CHALLENGE, MOCK_CODE_METHOD } from "../data";
import { Scope } from "@lindorm-io/jwt";
import { Session, ISessionOptions } from "../../../entity";

export const MOCK_SESSION_OPTIONS: ISessionOptions = {
  authorization: {
    codeChallenge: MOCK_CODE_CHALLENGE,
    codeMethod: MOCK_CODE_METHOD,
    email: "email@lindorm.io",
    id: "authorizationId",
    redirectUri: "redirectUri",
    responseType: "responseType",
  },
  clientId: "clientId",
  expires: new Date("2999-12-12 12:12:12.000"),
  grantType: "grantType",
  scope: Scope.DEFAULT,
};

export const mockRepositorySession = {
  create: jest.fn((entity: Session) => entity),
  update: jest.fn((entity: Session) => entity),
  find: jest.fn((filter: ISessionOptions) => new Session({ ...MOCK_SESSION_OPTIONS, ...filter })),
  findMany: jest.fn((filter: ISessionOptions) => [new Session({ ...MOCK_SESSION_OPTIONS, ...filter })]),
  remove: jest.fn((): any => undefined),
};
