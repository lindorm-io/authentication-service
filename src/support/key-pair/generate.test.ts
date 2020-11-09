import MockDate from "mockdate";
import { KeyType } from "@lindorm-io/key-pair";
import { generateKeyPair, generateKeys } from "./generate";

jest.mock("uuid", () => ({
  v4: jest.fn(() => "be3a62d1-24a0-401c-96dd-3aff95356811"),
}));
jest.mock("@lindorm-io/key-pair", () => ({
  ...jest.requireActual("@lindorm-io/key-pair"),
  generateECCKeys: jest.fn(() => ({
    algorithm: "ec-algorithm",
    privateKey: "ec-privateKey",
    publicKey: "ec-publicKey",
    type: "ec-type",
  })),
  generateRSAKeys: jest.fn(() => ({
    algorithm: "rsa-algorithm",
    passphrase: "rsa-passphrase",
    privateKey: "rsa-privateKey",
    publicKey: "rsa-publicKey",
    type: "rsa-type",
  })),
}));

MockDate.set("2020-01-01 08:00:00.000");

describe("generateKeys", () => {
  test("should generate EC keys", async () => {
    await expect(generateKeys(KeyType.EC)).resolves.toMatchSnapshot();
  });

  test("should generate RSA keys", async () => {
    await expect(generateKeys(KeyType.RSA)).resolves.toMatchSnapshot();
  });
});

describe("generateKeyPair", () => {
  test("should generate EC key pair", async () => {
    await expect(generateKeyPair(KeyType.EC)).resolves.toMatchSnapshot();
  });

  test("should generate RSA key pair", async () => {
    await expect(generateKeyPair(KeyType.RSA)).resolves.toMatchSnapshot();
  });
});
