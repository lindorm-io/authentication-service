import { IConfiguration } from "../typing";
import { NodeEnvironment } from "@lindorm-io/core";
import { configuration as development } from "./default-development";
import { configuration as production } from "./default-production";
import { configuration as staging } from "./default-staging";
import { configuration as test } from "./default-test";

export const switchConfiguration = (environment: string): IConfiguration => {
  switch (environment) {
    case NodeEnvironment.PRODUCTION:
      return production;

    case NodeEnvironment.STAGING:
      return staging;

    case NodeEnvironment.DEVELOPMENT:
      return development;

    case NodeEnvironment.TEST:
      return test;

    default:
      return development;
  }
};
