export type GenFn<T> = () => Generator<T>;
export type Option<T> = T | undefined;
export type Predicate<T> = (value: T) => boolean;
