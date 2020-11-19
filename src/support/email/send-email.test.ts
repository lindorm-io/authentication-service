import { Client } from "../../entity";
import { MOCK_CLIENT_OPTIONS } from "../../test/mocks/repository";
import { MOCK_LOGGER } from "../../test/mocks/logger";
import { sendEmailLink, sendEmailOTP } from "./send-email";

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
  let getMockContext: any;

  beforeEach(() => {
    getMockContext = () => ({
      client: new Client({
        ...MOCK_CLIENT_OPTIONS,
        emailAuthorizationUri: "https://lindorm.io/",
      }),
      logger: MOCK_LOGGER,
    });
  });

  afterEach(jest.resetAllMocks);

  test("sendEmailLink should resolve", async () => {
    await expect(
      sendEmailLink(getMockContext())({
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
      sendEmailOTP(getMockContext())({
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
