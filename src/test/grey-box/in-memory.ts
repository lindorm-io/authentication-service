import { TObject } from "@lindorm-io/core";

export let inMemoryCache: TObject<any> = {};
export let inMemoryEmail: Array<any> = [];
export let inMemoryStore: TObject<any> = {};

export const resetCache = (): void => {
  inMemoryCache = {};
};

export const resetEmail = (): void => {
  inMemoryEmail = [];
};

export const resetStore = (): void => {
  inMemoryStore = {};
};
