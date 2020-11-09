export enum GrantType {
  AUTHORIZATION_CODE = "authorization_code",
  CLIENT_CREDENTIALS = "client_credentials",
  DEVICE_PIN = "pin_code",
  DEVICE_SECRET = "biometrics",
  EMAIL_LINK = "email_link",
  EMAIL_OTP = "email_otp",
  IMPLICIT = "token",
  MULTI_FACTOR_OOB = "mfa-oob",
  MULTI_FACTOR_OTP = "mfa-otp",
  PASSWORD = "password",
  REFRESH_TOKEN = "refresh_token",
}
