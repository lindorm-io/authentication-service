import { sendEmailLink, sendEmailOTP } from "./send-email";
import { getTestClient, logger } from "../../test";

const mockSend = jest.fn();
jest.mock("../../class", () => ({
  ...jest.requireActual("../../class"),
  MailHandler: class MailHandler {
    constructor() {}
    send(...args: any) {
      mockSend(...args);
    }
  },
}));

describe("sendEmail", () => {
  let ctx: any;

  beforeEach(() => {
    ctx = {
      client: getTestClient(),
      logger,
    };
  });

  afterEach(jest.resetAllMocks);

  test("sendEmailLink should resolve", async () => {
    await expect(
      sendEmailLink(ctx)({
        grantType: "grantType",
        redirectUri: "redirectUri",
        state: "state",
        subject: "subject",
        token: "token",
      }),
    ).resolves.toBe(undefined);

    expect(mockSend).toHaveBeenCalledWith({
      subject: "Sign in to {{DOMAIN}}",
      text: "URL: https://lindorm.io/?grant_type=grantType&redirect_uri=redirectUri&state=state&token=token",
      to: "subject",
    });
  });

  test("sendEmailOTP should resolve", async () => {
    await expect(
      sendEmailOTP(ctx)({
        otpCode: "otpCode",
        subject: "subject",
      }),
    ).resolves.toBe(undefined);

    expect(mockSend).toHaveBeenCalledWith({
      subject: "Sign in to {{DOMAIN}}",
      text: "OTP: otpCode",
      to: "subject",
    });
  });
});
