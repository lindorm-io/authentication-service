import { AssertOTPError } from "../error";
import { authenticator } from "otplib";
import { v4 as uuid } from "uuid";
import { CryptoAES } from "@lindorm-io/crypto";
import { baseHash, baseParse } from "@lindorm-io/core";

export interface IOTPHandlerOptions {
  issuer: string;
  secret: string;
}

export interface IOTPHandlerGenerateData {
  signature: string;
  uri: string;
}

export interface IOTPHandlerVerifyData {
  success: boolean;
  timeUsed: number;
  timeRemaining: number;
}

export class OTPHandler {
  private issuer: string;
  private crypto: CryptoAES;

  constructor(options: IOTPHandlerOptions) {
    this.issuer = options.issuer;
    this.crypto = new CryptoAES({
      secret: options.secret,
    });
  }

  public generate(): IOTPHandlerGenerateData {
    const id = uuid();
    const secret = authenticator.generateSecret();
    const uri = authenticator.keyuri(id, this.issuer, secret);

    const signature = baseHash(this.crypto.encrypt(secret));

    return { uri, signature };
  }

  public verify(token: string, signature: string): IOTPHandlerVerifyData {
    const secret = this.crypto.decrypt(baseParse(signature));

    const success = authenticator.verify({ token, secret });
    const timeUsed = authenticator.timeUsed();
    const timeRemaining = authenticator.timeRemaining();

    return {
      success,
      timeUsed,
      timeRemaining,
    };
  }

  public assert(token: string, signature: string): void {
    const result = this.verify(token, signature);

    if (result.success) {
      return;
    }

    throw new AssertOTPError();
  }
}
