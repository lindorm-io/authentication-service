export let inMemoryCache: Record<string, any> = {};
export let inMemoryEmail: Array<any> = [];
export let inMemoryStore: Record<string, any> = {};

export const resetCache = (): void => {
  inMemoryCache = {};
};

export const resetEmail = (): void => {
  inMemoryEmail = [];
};

export const resetStore = (): void => {
  inMemoryStore = {};
};
