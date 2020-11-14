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

  const method = createHash(codeMethod);
  method.update(codeVerifier, "utf8");

  const codeChallenge = method.digest("base64");
  const state = getRandomValue(16);

  return {
    codeMethod,
    codeVerifier,
    codeChallenge,
    state,
  };
};
