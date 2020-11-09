import { switchConfiguration } from "./switch-configuration";
import { NodeEnvironment } from "@lindorm-io/core";

describe("switchConfiguration", () => {
  test("should return PRODUCTION", () => {
    expect(switchConfiguration(NodeEnvironment.PRODUCTION)).toMatchSnapshot();
  });

  test("should return STAGING", () => {
    expect(switchConfiguration(NodeEnvironment.STAGING)).toMatchSnapshot();
  });

  test("should return DEVELOPMENT", () => {
    expect(switchConfiguration(NodeEnvironment.DEVELOPMENT)).toMatchSnapshot();
  });

  test("should return TEST", () => {
    expect(switchConfiguration(NodeEnvironment.TEST)).toMatchSnapshot();
  });
});
