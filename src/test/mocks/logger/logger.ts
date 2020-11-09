import { Logger, LogLevel } from "@lindorm-io/winston";

export const MOCK_LOGGER = new Logger({
  packageName: "name",
  packageVersion: "version",
});

MOCK_LOGGER.addConsole(LogLevel.ERROR);
