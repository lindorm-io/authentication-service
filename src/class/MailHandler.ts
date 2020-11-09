import mailgunJs, { Mailgun, messages } from "mailgun-js";
import { NodeEnvironment } from "@lindorm-io/core";

export interface IMailHandlerOptions {
  apiKey: string;
  domain: string;
  environment: string;
  from: string;
}

export interface ISendOptions {
  to: string;
  subject: string;
  text: string;
  html?: string;
}

export class MailHandler {
  private mailgun: Mailgun;
  private environment: string;
  private from: string;

  constructor(options: IMailHandlerOptions) {
    this.mailgun = mailgunJs({
      apiKey: options.apiKey,
      domain: options.domain,
    });
    this.environment = options.environment;
    this.from = options.from;
  }

  public async send(options: ISendOptions): Promise<messages.SendResponse> {
    const { to, subject, text, html } = options;

    if (this.environment !== NodeEnvironment.PRODUCTION) {
      return Promise.resolve({ id: "development", message: "done" });
    }

    return this.mailgun.messages().send({
      from: this.from,
      to,
      subject,
      text,
      html: html || text,
    });
  }
}
