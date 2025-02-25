import type { GenFn, Predicate } from "../types.ts";
import { ExactSizedIter } from "./exact_sized.ts";
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

export class DoubleEndedIter<T> extends ExactSizedIter<T> {
  _rgen: GenFn<T>;
  constructor(gen: GenFn<T>, rgen: GenFn<T>, len: number) {
    super(gen, len);
    this._rgen = rgen;
  }

  rev(): DoubleEndedIter<T> {
    return new DoubleEndedIter(this._rgen, this._gen, this._len);
  }

  override map<U>(fn: (item: T) => U) {
    return new DoubleEndedIter(
      map(fn)(this._gen),
      map(fn)(this._rgen),
      this._len,
    );
  }

  override filter(fn: (item: T) => boolean) {
    return new DoubleEndedIter(
      filter(fn)(this._gen),
      filter(fn)(this._rgen),
      this._len,
    );
  }

  override take(n: number) {
    return new DoubleEndedIter(
      take<T>(n)(this._gen),
      take<T>(n)(this._rgen),
      n,
    );
  }

  override takeWhile(fn: Predicate<T>) {
    return new DoubleEndedIter(
      takeWhile(fn)(this._gen),
      takeWhile(fn)(this._rgen),
      this._len,
    );
  }

  override skip(n: number) {
    return new DoubleEndedIter(
      skip<T>(n)(this._gen),
      skip<T>(n)(this._rgen),
      this._len - n,
    );
  }

  override skipWhile(fn: Predicate<T>) {
    return new DoubleEndedIter(
      skipWhile(fn)(this._gen),
      skipWhile(fn)(this._rgen),
      this._len,
    );
  }

  override enumerate() {
    return new DoubleEndedIter(
      enumerate(this._gen),
      enumerate(this._rgen),
      this._len,
    );
  }

  override cycle() {
    return new DoubleEndedIter(cycle(this._gen), cycle(this._rgen), this._len);
  }
}
