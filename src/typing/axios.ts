import { ITokenIssuerSignData } from "@lindorm-io/jwt";

export interface IRequestChallengeVerifyData {
  challengeConfirmation: ITokenIssuerSignData;
}
