import { config } from "../../config";
import { Keystore } from "@lindorm-io/key-pair";
import { TokenIssuer } from "@lindorm-io/jwt";
import { getTestKeyPairEC } from "./test-key-pair";
import { logger } from "./test-logger";

export const getTestIssuer = (): TokenIssuer =>
  new TokenIssuer({
    issuer: config.JWT_ISSUER,
    keystore: new Keystore({ keys: [getTestKeyPairEC()] }),
    // @ts-ignore
    logger,
  });
