import MockDate from "mockdate";
import { AssertCodeChallengeError, AssertDeviceChallengeError } from "../../error";
import { Device, Session } from "../../entity";
import { KeyPairHandler } from "@lindorm-io/key-pair";
import { assertCodeChallenge, assertDeviceChallenge } from "./challenge";
import {
  MOCK_CODE_VERIFIER,
  MOCK_DEVICE_OPTIONS,
  MOCK_SESSION_OPTIONS,
  MOCK_RSA_PRIVATE_KEY,
  MOCK_RSA_PUBLIC_KEY,
} from "../../test/mocks";

jest.mock("uuid", () => ({
  v4: jest.fn(() => "be3a62d1-24a0-401c-96dd-3aff95356811"),
}));

MockDate.set("2020-01-01 08:00:00.000");

describe("assertCodeChallenge", () => {
  let session: Session;

  beforeEach(() => {
    session = new Session(MOCK_SESSION_OPTIONS);
  });

  test("should assert code challenge", () => {
    expect(assertCodeChallenge(session, MOCK_CODE_VERIFIER)).toBe(undefined);
  });

  test("should throw error", () => {
    expect(() => assertCodeChallenge(session, "wrong")).toThrow(expect.any(AssertCodeChallengeError));
  });
});

describe("assertDeviceChallenge", () => {
  let challenge: string;
  let device: Device;
  let session: Session;
  let handler: KeyPairHandler;

  beforeEach(() => {
    challenge = "MHNnb24yMzBqZ2hvNDJuMDI5ajAyNGdt";
    device = new Device(MOCK_DEVICE_OPTIONS);
    session = new Session({
      ...MOCK_SESSION_OPTIONS,
      authorization: {
        ...MOCK_SESSION_OPTIONS.authorization,
        deviceChallenge: challenge,
      },
    });

    handler = new KeyPairHandler({
      algorithm: "RS512",
      passphrase: "",
      privateKey: MOCK_RSA_PRIVATE_KEY,
      publicKey: MOCK_RSA_PUBLIC_KEY,
    });
  });

  test("should assert device challenge", async () => {
    expect(assertDeviceChallenge(session, device, handler.sign(challenge)));
  });

  test("should throw error", async () => {
    expect(() => assertDeviceChallenge(session, device, handler.sign("wrong"))).toThrow(
      expect.any(AssertDeviceChallengeError),
    );
  });
});
