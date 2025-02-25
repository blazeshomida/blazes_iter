import type { GenFn, Predicate } from "../types.ts";
import { ExactSizedIter } from "./exact_sized.ts";
import {
  all,
  any,
  count,
  cycle,
  enumerate,
  every,
  filter,
  find,
  fold,
  forEach,
  map,
  reduce,
  skip,
  skipWhile,
  some,
  take,
  takeWhile,
} from "./utils.ts";

export class Iter<T> {
  protected _gen: GenFn<T>;

  constructor(gen: GenFn<T>) {
    this._gen = gen;
  }

  *[Symbol.iterator]() {
    yield* this._gen();
  }

  map<U>(fn: (item: T) => U) {
    return new Iter(map(fn)(this._gen));
  }

  filter(fn: (item: T) => boolean) {
    return new Iter(filter(fn)(this._gen));
  }

  take(n: number) {
    return new ExactSizedIter(take<T>(n)(this._gen), n);
  }

  takeWhile(fn: Predicate<T>) {
    return new Iter(takeWhile(fn)(this._gen));
  }

  skip(n: number) {
    return new Iter(skip<T>(n)(this._gen));
  }

  skipWhile(fn: Predicate<T>) {
    return new Iter(skipWhile(fn)(this._gen));
  }

  fold<U>(init: U, fn: (acc: U, item: T) => U) {
    return fold(init, fn)(this._gen);
  }

  reduce(fn: (acc: T, item: T) => T) {
    return reduce(fn)(this._gen);
  }

  enumerate() {
    return new Iter(enumerate(this._gen));
  }

  count() {
    return count()(this._gen);
  }

  cycle() {
    return new Iter(cycle(this._gen));
  }

  any(predicate: Predicate<T>) {
    return any(predicate)(this._gen);
  }

  all(predicate: Predicate<T>) {
    return all(predicate)(this._gen);
  }

  /**  Alias to any */
  some(predicate: Predicate<T>) {
    return some(predicate)(this._gen);
  }

  /** Alias to all */
  every(predicate: Predicate<T>) {
    return every(predicate)(this._gen);
  }

  find(predicate: Predicate<T>) {
    return find(predicate)(this._gen);
  }

  forEach(fn: (item: T) => void) {
    return forEach(fn)(this._gen);
  }
}
