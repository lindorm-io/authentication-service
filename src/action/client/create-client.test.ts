import MockDate from "mockdate";
import { Account } from "../../entity";
import { MOCK_LOGGER } from "../../test/mocks";
import { getMockRepository, MOCK_ACCOUNT_OPTIONS } from "../../test/mocks";
import { createClient } from "./create-client";
import { getRandomValue } from "@lindorm-io/core";

jest.mock("uuid", () => ({
  v4: jest.fn(() => "be3a62d1-24a0-401c-96dd-3aff95356811"),
}));
jest.mock("../../support", () => ({
  assertAccountAdmin: jest.fn(() => () => undefined),
  encryptClientSecret: jest.fn(() => "encryptClientSecret"),
}));

MockDate.set("2020-01-01 08:00:00.000");
const date = new Date("2020-01-01 08:00:00.000");

describe("createClient", () => {
  let getMockContext: any;

  beforeEach(() => {
    getMockContext = () => ({
      account: new Account(MOCK_ACCOUNT_OPTIONS),
      logger: MOCK_LOGGER,
      repository: getMockRepository(),
    });
  });

  test("should create client", async () => {
    const ctx = getMockContext();

    await expect(
      createClient(ctx)({
        description: "description",
        emailAuthorizationUri: "https://lindorm.io/",
        name: "name",
        secret: getRandomValue(32),
      }),
    ).resolves.toStrictEqual({
      clientId: "be3a62d1-24a0-401c-96dd-3aff95356811",
    });

    expect(ctx.repository.client.create).toHaveBeenCalledWith({
      _approved: false,
      _created: date,
      _description: "description",
      _emailAuthorizationUri: "https://lindorm.io/",
      _events: [
        {
          created: date,
          name: "client_created",
          payload: {
            approved: false,
            created: date,
            description: "description",
            emailAuthorizationUri: "https://lindorm.io/",
            name: "name",
            secret: null,
            updated: date,
          },
        },
        {
          created: date,
          name: "client_secret_changed",
          payload: {
            secret: "encryptClientSecret",
          },
        },
      ],
      _id: "be3a62d1-24a0-401c-96dd-3aff95356811",
      _name: "name",
      _secret: "encryptClientSecret",
      _updated: date,
      _version: 0,
    });
  });
});
