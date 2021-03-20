import { AssertCodeChallengeError } from "../../error";
import { Session } from "../../entity";
import { createHash } from "crypto";
import { stringComparison } from "@lindorm-io/core";

export const assertCodeChallenge = (session: Session, codeVerifier: string): void => {
  const challenge = session.authorization.codeChallenge;
  const hash = createHash(session.authorization.codeMethod).update(codeVerifier, "utf8").digest("base64");

  if (!stringComparison(challenge, hash)) {
    throw new AssertCodeChallengeError(challenge, hash);
  }
};
