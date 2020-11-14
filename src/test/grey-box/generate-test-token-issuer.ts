import { KeyPair, Keystore } from "@lindorm-io/key-pair";
import { winston } from "../../logger";
import { JWT_ISSUER } from "../../config";
import { TokenIssuer } from "@lindorm-io/jwt";

const logger = winston.createChildLogger(["grey-box", "token-issuer"]);

export const generateTestTokenIssuer = (keyPair: KeyPair): TokenIssuer => {
  return new TokenIssuer({
    issuer: JWT_ISSUER,
    logger,
    keystore: new Keystore({ keys: [keyPair] }),
  });
};
