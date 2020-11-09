import MockDate from "mockdate";
import { Client } from "./Client";

jest.mock("uuid", () => ({
  v4: jest.fn(() => "be3a62d1-24a0-401c-96dd-3aff95356811"),
}));

MockDate.set("2020-01-01 08:00:00.000");

describe("Client.ts", () => {
  let client: Client;

  beforeEach(() => {
    client = new Client({
      approved: true,
      description: "description",
      emailAuthorizationUri: "https://lindorm.io",
      name: "name",
      secret: "secret",
    });
  });

  test("should have all data", () => {
    expect(client).toMatchSnapshot();
  });

  test("should have optional data", () => {
    client = new Client();

    expect(client).toMatchSnapshot();
  });

  test("should create", () => {
    client.create();
    expect(client.events).toMatchSnapshot();
  });

  test("should get/set approved", () => {
    expect(client.approved).toBe(true);

    client.approved = false;

    expect(client.approved).toBe(false);
    expect(client.events).toMatchSnapshot();
  });

  test("should get/set emailAuthorizationUri", () => {
    expect(client.emailAuthorizationUri).toBe("https://lindorm.io");

    client.emailAuthorizationUri = "https://lindorm.io/new";

    expect(client.emailAuthorizationUri).toBe("https://lindorm.io/new");
    expect(client.events).toMatchSnapshot();
  });

  test("should get/set description", () => {
    expect(client.description).toBe("description");

    client.description = "new-description";

    expect(client.description).toBe("new-description");
    expect(client.events).toMatchSnapshot();
  });

  test("should get/set name", () => {
    expect(client.name).toBe("name");

    client.name = "new-name";

    expect(client.name).toBe("new-name");
    expect(client.events).toMatchSnapshot();
  });

  test("should get/set secret", () => {
    expect(client.secret).toBe("secret");

    client.secret = "new-secret";

    expect(client.secret).toBe("new-secret");
    expect(client.events).toMatchSnapshot();
  });
});
