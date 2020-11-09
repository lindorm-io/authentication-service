import MockDate from "mockdate";
import { MailHandler } from "./MailHandler";

MockDate.set("2020-01-01 08:00:00.000");

describe("MailHandler", () => {
  let handler: MailHandler;

  beforeEach(() => {
    handler = new MailHandler({
      apiKey: "apiKey",
      domain: "domain",
      environment: "test",
      from: "from",
    });
  });

  test("should send an email", async () => {
    await expect(
      handler.send({
        to: "to",
        subject: "subject",
        text: "text",
      }),
    ).resolves.toStrictEqual({ id: "development", message: "done" });
  });
});
