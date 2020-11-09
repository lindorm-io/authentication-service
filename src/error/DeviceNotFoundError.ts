import { APIError, HttpStatus } from "@lindorm-io/core";

export class DeviceNotFoundError extends APIError {
  constructor(deviceId?: string) {
    super("Device not found", {
      debug: { deviceId },
      statusCode: HttpStatus.ClientError.BAD_REQUEST,
    });
  }
}
