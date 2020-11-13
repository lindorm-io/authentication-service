import { IIndex } from "@lindorm-io/mongo";

export const indices: Array<IIndex> = [
  {
    index: { id: 1 },
    options: { unique: true },
  },
  {
    index: { expires: 1 },
    options: { unique: false },
  },
  {
    index: { accountId: 1 },
    options: { unique: false },
  },
  {
    index: { refreshId: 1 },
    options: { unique: true },
  },
];
