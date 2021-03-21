export type TFunction<T> = (...args: any) => T;
export type TObject<T> = Record<string, T>;
export type TPromise<T> = (...args: any) => Promise<T>;
