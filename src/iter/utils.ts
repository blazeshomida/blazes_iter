import { getRangeParams, range as _range } from "../range/range.ts";
import type { GenFn, Option, Predicate } from "../types.ts";
import { DoubleEndedIter } from "./double_ended.ts";

export function range(end: number): DoubleEndedIter<number>;
export function range(start: number, end: number): DoubleEndedIter<number>;
export function range(
  start: number,
  end: number,
  step: number,
): DoubleEndedIter<number>;
export function range(
  arg1: number,
  arg2?: number,
  step: number = 1,
): DoubleEndedIter<number> {
  const [start, end] = getRangeParams(arg1, arg2);

  if (step === 0) throw new Error("Step cannot be 0");

  if ((step > 0 && start >= end) || (step < 0 && start <= end)) {
    return new DoubleEndedIter(_range(0, 0), _range(0, 0), 0); // Empty range
  }

  const last = end - ((end - start) % step || /* remainder */ step); // Last valid value of the range
  return new DoubleEndedIter(
    _range(start, end, step), // Forward range
    _range(last, start - step, -step), // Reverse range, properly aligned
    Math.ceil(Math.abs(end - start) / Math.abs(step)), // Correct length
  );
}

export function irange(end: number): DoubleEndedIter<number>;
export function irange(start: number, end: number): DoubleEndedIter<number>;
export function irange(
  start: number,
  end: number,
  step: number,
): DoubleEndedIter<number>;
export function irange(
  arg1: number,
  arg2?: number,
  step: number = 1,
): DoubleEndedIter<number> {
  const [start, end] = getRangeParams(arg1, arg2);
  return range(start, end + step, step);
}

export function repeat<T>(item: T): GenFn<T> {
  return function* () {
    while (true) yield item;
  };
}

export function enumerate<T>(gen: GenFn<T>): GenFn<[number, T]> {
  return function* () {
    let i = 0;
    for (const item of gen()) yield [i++, item];
  };
}

export function map<T, U>(fn: (item: T) => U): (gen: GenFn<T>) => GenFn<U> {
  return (gen) =>
    function* () {
      for (const item of gen()) yield fn(item);
    };
}

export function filter<T>(
  fn: (item: T) => boolean,
): (gen: GenFn<T>) => GenFn<T> {
  return (gen) =>
    function* () {
      for (const item of gen()) if (fn(item)) yield item;
    };
}

export function take<T>(n: number): (gen: GenFn<T>) => GenFn<T> {
  return (gen) =>
    function* () {
      let i = 0;
      for (const item of gen()) {
        if (i === n) break;
        yield item;
        i++;
      }
    };
}

export function takeWhile<T>(fn: Predicate<T>): (gen: GenFn<T>) => GenFn<T> {
  return (gen) =>
    function* () {
      for (const item of gen()) {
        if (!fn(item)) break;
        yield item;
      }
    };
}

export function skip<T>(n: number): (gen: GenFn<T>) => GenFn<T> {
  return (gen) =>
    function* () {
      let skip = n;
      for (const item of gen()) {
        if (skip <= 0) yield item;
        skip--;
      }
    };
}

export function skipWhile<T>(fn: Predicate<T>): (gen: GenFn<T>) => GenFn<T> {
  return (gen) =>
    function* () {
      for (const item of gen()) {
        if (fn(item)) continue;
        yield item;
      }
    };
}

export function fold<T, U>(
  init: U,
  fn: (acc: U, item: T) => U,
): (gen: GenFn<T>) => U {
  return (gen) => {
    let acc = init;
    for (const item of gen()) acc = fn(acc, item);
    return acc;
  };
}

export function reduce<T>(
  fn: (acc: T, item: T) => T,
): (gen: GenFn<T>) => Option<T> {
  return (gen) => {
    const iterator = gen();
    const first = iterator.next();
    if (first.done) return undefined; // 🔹 If empty, return `undefined`
    let acc = first.value; // 🔹 Start with the first element
    for (const item of iterator) {
      acc = fn(acc, item); // 🔹 Only apply `fn` to the rest of the elements
    }
    return acc;
  };
}

export function count<T>(): (gen: GenFn<T>) => number {
  return (gen) => fold(0, (acc) => acc + 1)(gen);
}

export function cycle<T>(gen: GenFn<T>): GenFn<T> {
  return function* () {
    while (true) yield* gen();
  };
}

export function any<T>(fn: Predicate<T>): (gen: GenFn<T>) => boolean {
  return (gen) => {
    for (const item of gen()) if (fn(item)) return true;
    return false;
  };
}

export function all<T>(fn: Predicate<T>): (gen: GenFn<T>) => boolean {
  return (gen) => {
    for (const item of gen()) if (!fn(item)) return false;
    return true;
  };
}

export function find<T>(fn: Predicate<T>): (gen: GenFn<T>) => Option<T> {
  return (gen) => {
    for (const item of gen()) if (fn(item)) return item;
    return undefined;
  };
}

export function forEach<T>(fn: (item: T) => void): (gen: GenFn<T>) => void {
  return (gen) => {
    for (const item of gen()) fn(item);
  };
}

/**  Alias to any */
export const some = any;
/**  Alias to all */
export const every = all;
