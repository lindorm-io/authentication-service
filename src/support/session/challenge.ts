import { AssertCodeChallengeError, AssertDeviceChallengeError } from "../../error";
import { Device, Session } from "../../entity";
import { KeyPairHandler } from "@lindorm-io/key-pair";
import { createHash } from "crypto";
import { stringComparison } from "@lindorm-io/core";

export const assertCodeChallenge = (session: Session, codeVerifier: string): void => {
  const challenge = session.authorization.codeChallenge;
  const hash = createHash(session.authorization.codeMethod).update(codeVerifier, "utf8").digest("base64");

  if (!stringComparison(challenge, hash)) {
    throw new AssertCodeChallengeError(challenge, hash);
  }
};

export const assertDeviceChallenge = (session: Session, device: Device, deviceVerifier: string): void => {
  const { publicKey } = device;

  const challenge = session.authorization.deviceChallenge;
  const handler = new KeyPairHandler({
    algorithm: "RS512",
    passphrase: "",
    privateKey: null,
    publicKey,
  });

  try {
    handler.assert(challenge, deviceVerifier);
  } catch (err) {
    throw new AssertDeviceChallengeError(challenge, deviceVerifier);
  }
};
