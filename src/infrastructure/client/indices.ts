import { IIndex } from "@lindorm-io/mongo";

export const indices: Array<IIndex> = [
  {
    index: { id: 1 },
    options: { unique: true },
  },
];
