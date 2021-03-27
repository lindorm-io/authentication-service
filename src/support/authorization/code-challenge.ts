import { AssertCodeChallengeError } from "../../error";
import { Authorization } from "../../entity";
import { createHash } from "crypto";
import { stringComparison } from "@lindorm-io/core";

export const assertCodeChallenge = (authorization: Authorization, codeVerifier: string): void => {
  const challenge = authorization.codeChallenge;
  const hash = createHash(authorization.codeMethod).update(codeVerifier, "utf8").digest("base64");

  if (!stringComparison(challenge, hash)) {
    throw new AssertCodeChallengeError(challenge, hash);
  }
};
