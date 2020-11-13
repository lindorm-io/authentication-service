import MockDate from "mockdate";
import { GrantType } from "../../enum";
import { RequestLimit } from "../../entity";
import { getBackOffDate } from "./back-off";

jest.mock("uuid", () => ({
  v4: jest.fn(() => "be3a62d1-24a0-401c-96dd-3aff95356811"),
}));

MockDate.set("2020-01-01 08:00:00.000");

describe("getBackOffDate", () => {
  describe("duration", () => {
    test("should resolve with 1 minutes added", () => {
      expect(
        getBackOffDate(
          new RequestLimit({
            subject: "email@lindorm.io",
            grantType: GrantType.DEVICE_PIN,
            failedTries: 3,
          }),
        ),
      ).toMatchSnapshot();
    });

    test("should resolve with 3 minutes added", () => {
      expect(
        getBackOffDate(
          new RequestLimit({
            subject: "email@lindorm.io",
            grantType: GrantType.DEVICE_PIN,
            failedTries: 4,
          }),
        ),
      ).toMatchSnapshot();
    });

    test("should resolve with 30 minutes added", () => {
      expect(
        getBackOffDate(
          new RequestLimit({
            subject: "email@lindorm.io",
            grantType: GrantType.DEVICE_PIN,
            failedTries: 7,
          }),
        ),
      ).toMatchSnapshot();
    });
  });

  describe("grantType", () => {
    test("should resolve for DEVICE_PIN", () => {
      expect(
        getBackOffDate(
          new RequestLimit({
            subject: "email@lindorm.io",
            grantType: GrantType.DEVICE_PIN,
            failedTries: 3,
          }),
        ),
      ).toMatchSnapshot();
    });

    test("should resolve for DEVICE_SECRET", () => {
      expect(
        getBackOffDate(
          new RequestLimit({
            subject: "email@lindorm.io",
            grantType: GrantType.DEVICE_SECRET,
            failedTries: 3,
          }),
        ),
      ).toMatchSnapshot();
    });

    test("should resolve for EMAIL_LINK", () => {
      expect(
        getBackOffDate(
          new RequestLimit({
            subject: "email@lindorm.io",
            grantType: GrantType.EMAIL_LINK,
            failedTries: 3,
          }),
        ),
      ).toMatchSnapshot();
    });

    test("should resolve for EMAIL_OTP", () => {
      expect(
        getBackOffDate(
          new RequestLimit({
            subject: "email@lindorm.io",
            grantType: GrantType.EMAIL_OTP,
            failedTries: 3,
          }),
        ),
      ).toMatchSnapshot();
    });

    test("should resolve for MULTI_FACTOR_OOB", () => {
      expect(
        getBackOffDate(
          new RequestLimit({
            subject: "email@lindorm.io",
            grantType: GrantType.MULTI_FACTOR_OOB,
            failedTries: 3,
          }),
        ),
      ).toMatchSnapshot();
    });

    test("should resolve for MULTI_FACTOR_OTP", () => {
      expect(
        getBackOffDate(
          new RequestLimit({
            subject: "email@lindorm.io",
            grantType: GrantType.MULTI_FACTOR_OTP,
            failedTries: 3,
          }),
        ),
      ).toMatchSnapshot();
    });

    test("should resolve for PASSWORD", () => {
      expect(
        getBackOffDate(
          new RequestLimit({
            subject: "email@lindorm.io",
            grantType: GrantType.PASSWORD,
            failedTries: 3,
          }),
        ),
      ).toMatchSnapshot();
    });

    test("should resolve for REFRESH_TOKEN", () => {
      expect(
        getBackOffDate(
          new RequestLimit({
            subject: "email@lindorm.io",
            grantType: GrantType.REFRESH_TOKEN,
            failedTries: 3,
          }),
        ),
      ).toMatchSnapshot();
    });
  });
});
