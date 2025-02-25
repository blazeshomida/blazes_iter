import { DoubleEndedIter } from "./double_ended.ts";

/**
 * Creates a generator function that yields a sequence of numbers.
 *
 * @param start - The starting value.
 * @param end - The ending value (exclusive).
 * @param step - The step value (default: `1`).
 * @returns A generator function that yields numbers in the given range.
 *
 * @throws {Error} If `step` is `0`, as zero-step iteration is invalid.
 *
 * @example
 * ```ts
 * import { assertEquals } from "@std/assert";
 * assertEquals([...rangeGen(0, 5)()], [0, 1, 2, 3, 4]);
 * assertEquals([...rangeGen(2, 10, 2)()], [2, 4, 6, 8]);
 * ```
 */
export function rangeGen(start: number, end: number, step: number = 1) {
  return function* () {
    if (step === 0) throw new Error("Step cannot be 0");
    const min = Math.min(start, end);
    for (let i = start; min === start ? i < end : i > end; i += step) {
      yield i;
    }
  };
}

/**
 * Computes the start and end values for a range based on the provided arguments.
 *
 * If only one argument is provided, it is treated as `end`, and `start` is assumed to be `0`.
 * If two arguments are provided, they are treated as `[start, end]`.
 *
 * @param arg1 - The first argument, interpreted as `end` if `arg2` is not provided, or as `start` if `arg2` is provided.
 * @param arg2 - The optional second argument, interpreted as the `end` value.
 * @returns A tuple `[start, end]` computed based on the input.
 *
 * @example
 * ```ts
 * import { assertEquals } from "@std/assert";
 * assertEquals(getRangeParams(5), [0, 5]);
 * assertEquals(getRangeParams(2, 10), [2, 10]);
 * ```
 *
 * @see {@link range}
 * @see {@link irange}
 */
export function getRangeParams(arg1: number, arg2?: number): [number, number] {
  const end = arg2 ?? arg1;
  const start = arg2 !== undefined ? arg1 : 0;
  return [start, end];
}

/**
 * Creates an iterable range of numbers from `0` to `end - 1`.
 *
 * @param end - The upper bound (exclusive).
 * @returns A `DoubleEndedIter<number>` instance.
 *
 * @example
 * ```ts
 * import { assertEquals } from "@std/assert";
 * assertEquals([...range(5)], [0, 1, 2, 3, 4]);
 * ```
 */
export function range(end: number): DoubleEndedIter<number>;

/**
 * Creates an iterable range of numbers from `start` to `end - 1`.
 *
 * @param start - The lower bound of the range.
 * @param end - The upper bound (exclusive).
 * @returns A `DoubleEndedIter<number>` instance.
 *
 * @example
 * ```ts
 * import { assertEquals } from "@std/assert";
 * assertEquals([...range(2, 6)], [2, 3, 4, 5]);
 * ```
 */
export function range(start: number, end: number): DoubleEndedIter<number>;

/**
 * Creates an iterable range of numbers from `start` to `end - 1`, incrementing by `step`.
 *
 * @param start - The lower bound of the range.
 * @param end - The upper bound (exclusive).
 * @param step - The increment step (default: `1`).
 * @returns A `DoubleEndedIter<number>` instance.
 *
 * @throws {Error} If `step` is `0`, as zero-step iteration is invalid.
 *
 * @example
 * ```ts
 * import { assertEquals } from "@std/assert";
 * assertEquals([...range(1, 10, 2)], [1, 3, 5, 7, 9]);
 * assertEquals([...range(10, 0, -2)], [10, 8, 6, 4, 2]);
 * ```
 */
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
    return new DoubleEndedIter(rangeGen(0, 0), rangeGen(0, 0), 0); // Empty range
  }

  const last = end - ((end - start) % step || step);
  return new DoubleEndedIter(
    rangeGen(start, end, step),
    rangeGen(last, start - step, -step),
    Math.ceil(Math.abs(end - start) / Math.abs(step)),
  );
}

/**
 * Creates an iterable range of numbers from `0` to `end`, **including `end`**.
 *
 * @param end - The upper bound (inclusive).
 * @returns A `DoubleEndedIter<number>` instance.
 *
 * @example
 * ```ts
 * import { assertEquals } from "@std/assert";
 * assertEquals([...irange(3)], [0, 1, 2, 3]);
 * ```
 */
export function irange(end: number): DoubleEndedIter<number>;

/**
 * Creates an iterable range of numbers from `start` to `end`, **including `end`**.
 *
 * @param start - The lower bound of the range.
 * @param end - The upper bound (inclusive).
 * @returns A `DoubleEndedIter<number>` instance.
 *
 * @example
 * ```ts
 * import { assertEquals } from "@std/assert";
 * assertEquals([...irange(2, 5)], [2, 3, 4, 5]);
 * ```
 */
export function irange(start: number, end: number): DoubleEndedIter<number>;

export function irange(
  start: number,
  end: number,
  step: number,
): DoubleEndedIter<number>;

/**
 * Creates an iterable range of numbers from `start` to `end`, **including `end`**, using a custom `step`.
 *
 * @param start - The lower bound of the range.
 * @param end - The upper bound (inclusive).
 * @param step - The increment step (default: `1`).
 * @returns A `DoubleEndedIter<number>` instance.
 *
 * @throws {Error} If `step` is `0`, as zero-step iteration is invalid.
 *
 * @example
 * ```ts
 * import { assertEquals } from "@std/assert";
 * assertEquals([...irange(1, 10, 2)], [1, 3, 5, 7, 9]);
 * assertEquals([...irange(10, 0, -2)], [10, 8, 6, 4, 2, 0]);
 * ```
 */
export function irange(
  arg1: number,
  arg2?: number,
  step: number = 1,
): DoubleEndedIter<number> {
  const [start, end] = getRangeParams(arg1, arg2);

  if (step === 0) throw new Error("Step cannot be 0");

  const last = step > 0
    ? start + Math.floor((end - start) / step) * step
    : start + Math.ceil((end - start) / step) * step;

  return new DoubleEndedIter(
    rangeGen(start, last + step, step),
    rangeGen(last, start - step, -step),
    Math.floor(Math.abs(end - start) / Math.abs(step)) + 1,
  );
}
