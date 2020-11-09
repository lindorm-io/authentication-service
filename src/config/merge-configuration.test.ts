import { mergeConfiguration } from "./merge-configuration";
import { configuration as defaultDevelopment } from "./default-development";
import { configuration as defaultTest } from "./default-test";

describe("mergeConfig", () => {
  test("should prioritize primary input", () => {
    expect(mergeConfiguration(defaultTest, defaultDevelopment)).toMatchSnapshot();
  });
});
