import { IKoaAuthContext } from "../../typing";
import { IS_TEST, MAIL_HANDLER_CONFIG } from "../../config";
import { MailHandler } from "../../class";
import { inMemoryEmail } from "../../test";

const mailHandler = new MailHandler(MAIL_HANDLER_CONFIG);

export interface ISendEmailLinkOptions {
  grantType: string;
  redirectUri: string;
  state: string;
  subject: string;
  token: string;
}

export interface ISendEmailOTPOptions {
  otpCode: string;
  subject: string;
}

export const sendEmailLink = (ctx: IKoaAuthContext) => async (options: ISendEmailLinkOptions): Promise<void> => {
  const { client, logger } = ctx;
  const { grantType, redirectUri, state, subject, token } = options;

  const url = new URL(client.extra.emailAuthorizationUri);

  url.searchParams.append("grant_type", encodeURI(grantType));
  url.searchParams.append("redirect_uri", encodeURI(redirectUri));
  url.searchParams.append("state", encodeURI(state));
  url.searchParams.append("token", encodeURI(token));

  if (IS_TEST) {
    inMemoryEmail.push({
      emailAuthorizationUri: client.extra.emailAuthorizationUri,
      grantType,
      redirectUri,
      state,
      to: subject,
      token,
    });
  }

  await mailHandler.send({
    to: subject,
    subject: "Sign in to {{DOMAIN}}",
    text: `URL: ${url.toString()}`,
  });

  logger.debug("email with authorization token sent", { subject });
};

export const sendEmailOTP = (ctx: IKoaAuthContext) => async (options: ISendEmailOTPOptions): Promise<void> => {
  const { logger } = ctx;
  const { otpCode, subject } = options;

  if (IS_TEST) {
    inMemoryEmail.push({
      otpCode,
      to: subject,
    });
  }

  await mailHandler.send({
    to: subject,
    subject: "Sign in to {{DOMAIN}}",
    text: `OTP: ${otpCode}`,
  });

  logger.debug("email with authorization otp sent", { subject });
};
