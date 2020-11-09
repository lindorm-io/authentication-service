import { Logger, LogLevel } from "@lindorm-io/winston";
import { NODE_ENVIRONMENT } from "../config";
import { NodeEnvironment } from "@lindorm-io/core";
import { join } from "path";
import { readFileSync } from "fs";

const pkg = readFileSync(join(__dirname, "..", "..", "package.json"), { encoding: "utf8" });
const { name, version } = JSON.parse(pkg);

export const winston = new Logger({
  packageName: name,
  packageVersion: version,
});

if (NODE_ENVIRONMENT === NodeEnvironment.DEVELOPMENT) {
  winston.addConsole(LogLevel.DEBUG);
  winston.addTail(LogLevel.DEBUG);
}

if (NODE_ENVIRONMENT === NodeEnvironment.TEST) {
  winston.addConsole(LogLevel.ERROR);
}

if (NODE_ENVIRONMENT === NodeEnvironment.PRODUCTION) {
  winston.addFileTransport(LogLevel.ERROR);
  winston.addFileTransport(LogLevel.WARN);
  winston.addFileTransport(LogLevel.INFO);
  winston.addFileTransport(LogLevel.VERBOSE);
  winston.addFileTransport(LogLevel.DEBUG);
  winston.addFileTransport(LogLevel.SILLY);

  winston.addFilter("request.body.password");
  winston.addFilter("request.body.secret");
}
