import { IConfiguration } from "../typing";
import { TObject } from "@lindorm-io/core";

export const mergeConfiguration = (primary: IConfiguration, secondary: IConfiguration): IConfiguration => {
  const object: TObject<any> = secondary;

  for (const [key, value] of Object.entries(primary)) {
    if (value === null || value === undefined) continue;
    object[key] = value;
  }

  const result: unknown = object;
  return result as IConfiguration;
};
