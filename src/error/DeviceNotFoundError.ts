import { APIError } from "@lindorm-io/errors";
import { HttpStatus } from "@lindorm-io/core";

export class DeviceNotFoundError extends APIError {
  constructor(deviceId?: string) {
    super("Device not found", {
      debug: { deviceId },
      statusCode: HttpStatus.ClientError.BAD_REQUEST,
    });
  }
}
