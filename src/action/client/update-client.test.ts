import MockDate from "mockdate";
import { Account } from "../../entity";
import { getMockCache, MOCK_LOGGER, MOCK_UUID, getMockRepository, MOCK_ACCOUNT_OPTIONS } from "../../test/mocks";
import { updateClient } from "./update-client";
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

describe("updateClient", () => {
  let getMockContext: any;

  beforeEach(() => {
    getMockContext = () => ({
      account: new Account(MOCK_ACCOUNT_OPTIONS),
      cache: getMockCache(),
      logger: MOCK_LOGGER,
      repository: getMockRepository(),
    });
  });

  test("should update client", async () => {
    const ctx = getMockContext();

    await expect(
      updateClient(ctx)({
        clientId: MOCK_UUID,
        approved: true,
        description: "description",
        emailAuthorizationUri: "https://lindorm.io/",
        name: "name",
        secret: getRandomValue(32),
      }),
    ).resolves.toBe(undefined);

    expect(ctx.repository.client.update).toHaveBeenCalledWith({
      _approved: true,
      _created: date,
      _description: "description",
      _emailAuthorizationUri: "https://lindorm.io/",
      _events: [
        {
          date: date,
          name: "client_approved_changed",
          payload: {
            approved: true,
          },
        },
        {
          date: date,
          name: "client_description_changed",
          payload: {
            description: "description",
          },
        },
        {
          date: date,
          name: "client_email_authorization_uri_changed",
          payload: {
            uri: "https://lindorm.io/",
          },
        },
        {
          date: date,
          name: "client_name_changed",
          payload: {
            name: "name",
          },
        },
        {
          date: date,
          name: "client_secret_changed",
          payload: {
            secret: "encryptClientSecret",
          },
        },
      ],
      _id: MOCK_UUID,
      _name: "name",
      _secret: "encryptClientSecret",
      _updated: date,
      _version: 0,
    });
    expect(ctx.cache.client.update).toHaveBeenCalled();
  });
});
