import type { GenFn } from "../types.ts";

export function getRangeParams(arg1: number, arg2?: number) {
  const end = arg2 ?? arg1;
  const start = arg2 !== undefined ? arg1 : 0;
  return [start, end];
}

export function range(end: number): GenFn<number>;
export function range(start: number, end: number): GenFn<number>;
export function range(
  start: number,
  end: number,
  step: number,
): GenFn<number>;
export function range(
  arg1: number,
  arg2?: number,
  step: number = 1,
): GenFn<number> {
  const [start, end] = getRangeParams(arg1, arg2);
  return function* () {
    if (step === 0) throw new Error("Step cannot be 0");
    const min = Math.min(start, end);
    for (let i = start; min === start ? i < end : i > end; i += step) {
      yield i;
    }
  };
}

export function irange(end: number): GenFn<number>;
export function irange(start: number, end: number): GenFn<number>;
export function irange(
  start: number,
  end: number,
  step: number,
): GenFn<number>;
export function irange(
  arg1: number,
  arg2?: number,
  step: number = 1,
): GenFn<number> {
  const [start, end] = getRangeParams(arg1, arg2);
  return range(start, end + step, step);
}
