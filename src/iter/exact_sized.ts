import type { GenFn, Predicate } from "../types.ts";
import { Iter } from "./iter.ts";
import {
  cycle,
  enumerate,
  filter,
  map,
  skip,
  skipWhile,
  take,
  takeWhile,
} from "./utils.ts";

export class ExactSizedIter<T> extends Iter<T> {
  protected _len: number;
  constructor(gen: GenFn<T>, len: number) {
    super(gen);
    this._len = len;
  }

  override *[Symbol.iterator]() {
    let i = 0;
    for (const item of this._gen()) {
      if (i === this._len) break;
      yield item;
      i++;
    }
  }

  len(): number {
    return this._len;
  }

  override map<U>(fn: (item: T) => U) {
    return new ExactSizedIter(map(fn)(this._gen), this._len);
  }
  override filter(fn: (item: T) => boolean) {
    return new ExactSizedIter(filter(fn)(this._gen), this._len);
  }
  override take(n: number) {
    return new ExactSizedIter(take<T>(n)(this._gen), n);
  }

  override takeWhile(fn: Predicate<T>) {
    return new ExactSizedIter(takeWhile(fn)(this._gen), this._len);
  }

  override skip(n: number) {
    return new ExactSizedIter(skip<T>(n)(this._gen), this._len - n);
  }

  override skipWhile(fn: Predicate<T>) {
    return new ExactSizedIter(skipWhile(fn)(this._gen), this._len);
  }

  override enumerate() {
    return new ExactSizedIter(enumerate(this._gen), this._len);
  }

  override cycle() {
    return new ExactSizedIter(cycle(this._gen), this._len);
  }
}
