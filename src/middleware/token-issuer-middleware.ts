import { TOKEN_ISSUER_MW_OPTIONS } from "../config";
import { tokenIssuerMiddleware as _tokenIssuerMiddleware } from "@lindorm-io/koa-jwt";

export const tokenIssuerMiddleware = _tokenIssuerMiddleware(TOKEN_ISSUER_MW_OPTIONS);
