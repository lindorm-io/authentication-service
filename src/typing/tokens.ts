import { ITokenIssuerSignData } from "@lindorm-io/jwt";

export interface ICreateTokensData {
  accessToken?: ITokenIssuerSignData;
  identityToken?: ITokenIssuerSignData;
  multiFactorToken?: ITokenIssuerSignData;
  refreshToken?: ITokenIssuerSignData;
}
