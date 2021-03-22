import { getRandomValue } from "@lindorm-io/core";
import { createHash } from "crypto";

export interface IGenerateTestOauthData {
  codeMethod: string;
  codeVerifier: string;
  codeChallenge: string;
  state: string;
}

export const generateTestOauthData = (): IGenerateTestOauthData => {
  const codeMethod = "sha256";
  const codeVerifier = getRandomValue(32);
  const codeChallenge = createHash(codeMethod).update(codeVerifier, "utf8").digest("base64");
  const state = getRandomValue(16);

  return {
    codeMethod,
    codeVerifier,
    codeChallenge,
    state,
  };
};
